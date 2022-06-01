const factory = require("../../_util/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");
const Hotel = require("../../../models/Hotel");
const Room = require("../../../models/Room");
const AppError = require("../../../utils/appError");
const APIFeatures = require("../../_util/apiFeatures");

exports.getAllHotels = factory.getAllwithQuery(
  Hotel,
  { is_published: true },
  "hotel"
);

exports.getHotel = factory.getOne(Hotel, "hotel");

exports.getNearbyHotels = catchAsync(async (req, res, next) => {
  const { lat, long } = req.params;

  const hotels = await Hotel.find({
    crimeLocationCoordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [long, lat],
        },
        $maxDistance: 500000,
      },
    },
  });

  return res.json({
    success: true,
    results: hotels.length,
    hotels,
  });
});

exports.searchHotels = catchAsync(async (req, res, next) => {
  const { searchKey } = req.body;

  const features = new APIFeatures(
    Hotel.find({ name: new RegExp(searchKey, "i") }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const hotels = await features.query;

  return res.json({
    status: "success",
    results: hotels.length,
    products: hotels,
  });
});

exports.getHotelRooms = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findOne({ _id: hotelId }).select(
    "name is_published"
  );

  if (!hotel) {
    return next(new AppError("No hotel found with that id", 404));
  }

  if (!hotel.is_published) {
    return next(new AppError("Forbidden! hotel not available", 403));
  }

  const rooms = await Room.find({ hotelId });

  return res.json({
    success: true,
    rooms,
  });
});

exports.getHotelRoomsAvailablity = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;
  const { date } = req.body;

  const hotel = await Hotel.findOne({ _id: hotelId }).select("name");

  if (!hotel) {
    return next(new AppError("No hotel found with that id", 404));
  }

  if (!hotel.is_published) {
    return next(new AppError("Forbidden! hotel not available", 403));
  }

  const rooms = await Room.find({ hotelId });

  const roomBookings = await Room.find({ date, hotelId });

  /* check how many rooms are booked of each type */
  const roomsAvailablity = [];
  for (const room of rooms) {
    // find number of rooms booked with id: room.id

    let roomDetails = room;
    roomDetails.roomAvilable = getAvailablity(room, roomBookings);

    roomsAvailablity.push(roomDetails);
  }

  return res.json({
    success: true,
    date,
    roomsAvailable: roomsAvailablity,
  });
});
