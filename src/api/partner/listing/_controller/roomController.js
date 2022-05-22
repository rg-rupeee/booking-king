const Hotel = require("../../../../models/Hotel");
const Room = require("../../../../models/Room");
const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");

const validateHotel = async (hotelId, userId) => {
  const hotel = await Hotel.findOne({ _id: hotelId });

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

const validateRoom = async (room, hotelId) => {
  if (!room) {
    throw new AppError("No room found with that id", 404);
  }

  if (!room.hotelId.equals(hotelId)) {
    throw new AppError(
      "Forbidden! cannot access hotel not belonging to this user",
      403
    );
  }
};

exports.createRoom = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;
  const roomData = req.body;

  await validateHotel(hotelId, req.user.id);

  roomData.hotelId = hotelId;
  roomData.partnerId = req.user.id;

  const room = await Room.create(roomData);

  return res.status(201).json({
    success: true,
    room,
  });
});

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  await validateHotel(hotelId, req.user.id);

  const rooms = await Room.find({ hotelId });

  return res.json({
    success: true,
    rooms,
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const { hotelId, roomId } = req.params;

  await validateHotel(hotelId, req.user.id);

  const room = await Room.findOne({ _id: roomId });
  await validateRoom(room, hotelId, next);

  return res.json({
    success: true,
    room,
  });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
  const { hotelId, roomId } = req.params;

  await validateHotel(hotelId, req.user.id);

  const room = await Room.findOne({ _id: roomId });
  await validateRoom(room, hotelId, next);

  const updated = await Room.findOneAndUpdate({ _id: room._id }, req.body, {
    runValidators: true,
    new: true,
  });

  return res.json({
    success: true,
    room: updated,
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const { hotelId, roomId } = req.params;

  await validateHotel(hotelId, req.user.id);

  const room = await Room.findOne({ _id: roomId });
  await validateRoom(room, hotelId, next);

  await Room.findOneAndDelete({ _id: room._id });

  return res.status(204).json({
    success: true,
  });
});
