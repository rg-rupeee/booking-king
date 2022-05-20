const Hotel = require("../../../../models/Hotel");
const Partner = require("../../../../models/Partner");
const AppError = require("../../../../utils/appError");

const catchAsync = require("../../../../utils/catchAsync");

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
  const { id } = req.params;

  const hotel = await Hotel.findOne({ _id: id });

  if (!hotel) {
    return next(new AppError("No hotel found with that id", 404));
  }

  if (!hotel.partnerId.equals(req.user.id)) {
    return next(
      new AppError(
        "Forbidden! cannot access hotel not belonging to this user",
        403
      )
    );
  }

  return res.json({
    success: true,
    hotel,
  });
});

exports.updateListedHotel = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const hotel = await Hotel.findOne({ _id: id });

  if (!hotel) {
    return next(new AppError("No hotel found with that id", 404));
  }

  if (!hotel.partnerId.equals(req.user.id)) {
    return next(
      new AppError(
        "Forbidden! cannot access hotel not belonging to this user",
        403
      )
    );
  }

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
  const { id } = req.params;

  const hotel = await Hotel.findOne({ _id: id });

  if (!hotel) {
    return next(new AppError("No hotel found with that id", 404));
  }

  if (!hotel.partnerId.equals(req.user.id)) {
    return next(
      new AppError(
        "Forbidden! cannot access hotel not belonging to this user",
        403
      )
    );
  }

  await Hotel.findOneAndDelete({ _id: hotel._id });

  return res.status(204).json({
    success: true,
  });
});

exports.createRoomType = catchAsync(async (req, res, next) => {});
