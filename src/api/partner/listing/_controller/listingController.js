const Hotel = require("../../../../models/Hotel");
const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");

const validateHotel = async (hotel, userId) => {
  if (!hotel) {
    throw new AppError("No hotel found with that id", 404);
  }

  if (!hotel.partnerId.equals(userId)) {
    throw new AppError(
      "Forbidden! cannot access hotel not belonging to this user",
      403
    );
  }
};

exports.listHotel = catchAsync(async (req, res, next) => {
  const hotelData = req.body;

  hotelData.partnerId = req.user.id;

  const hotel = await Hotel.create(hotelData);

  return res.status(201).json({
    success: true,
    hotel,
  });
});

exports.getListedHotels = catchAsync(async (req, res, next) => {
  const hotels = await Hotel.find({ partnerId: req.user.id });

  return res.json({
    success: true,
    hotels,
  });
});

exports.getListedHotel = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findOne({ _id: hotelId });
  await validateHotel(hotel, req.user.id);

  return res.json({
    success: true,
    hotel,
  });
});

exports.updateListedHotel = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findOne({ _id: hotelId });
  await validateHotel(hotel, req.user.id);

  const updatedHotel = await Hotel.findOneAndUpdate(
    { _id: hotel._id },
    req.body,
    { runValidators: true, new: true }
  );

  return res.json({
    success: true,
    hotel: updatedHotel,
  });
});

exports.deleteListedHotel = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findOne({ _id: hotelId });
  await validateHotel(hotel, req.user.id);

  await Hotel.findOneAndDelete({ _id: hotel._id });

  return res.status(204).json({
    success: true,
  });
});
