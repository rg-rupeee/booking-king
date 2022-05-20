const factory = require("../../_util/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");
const Hotel = require("../../../models/Hotel");

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

exports.getHotelRoomsAvailablity = catchAsync(async (req, res, next) => {});
