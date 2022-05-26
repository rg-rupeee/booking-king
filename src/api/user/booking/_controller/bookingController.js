const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");

const Booking = require("../../../../models/Booking");
const Room = require("../../../../models/Room");
const RoomSlotsBooking = require("../../../../models/RoomSlotsBooking");

const validateBooking = async (booking, userId) => {
  if (!booking) {
    throw new AppError("No booking found with that id", 404);
  }

  if (booking.userId.equals(userId)) {
    throw new AppError("Forbidden! cannot access this booking", 403);
  }
};

const getRoom = async (hotelId, roomId) => {
  const room = await Room.findOne({ _id: roomId });

  if (!room) {
    throw new AppError(`No room found with id ${roomId}`, 404);
  }

  if (!room.hotelId.equals(hotelId)) {
    throw new AppError(
      `room with roomId: ${roomId} dosen't belong to the hotel with hotelId: ${hotelId}`,
      404
    );
  }

  return Room;
};

const validateRoomAvailablity = async (fromDate, toDate, hotelId, rooms) => {
  for (const room of rooms) {
    const hotelRoom = await getRoom(hotelId, room.roomId);

    for (let date = fromDate; date <= toDate; date.setDate(i.getDate() + 1)) {
      const roomSlot = await RoomSlotsBooking.find({
        roomId: room.roomId,
        date,
      });

      if (hotelRoom.noRooms < roomSlot.length + room.noRooms) {
        throw new AppError(
          `Only ${room.noRooms - roomSlot.length} rooms with roomId: ${
            room.roomId
          } available`,
          400
        );
      }
    }
  }
};

const createBookingRoomSlots = async (booking) => {
  const roomSlots = [];
  const fromDate = new Date(booking.fromDate);
  const toDate = new Date(booking.toDate);

  for (let date = fromDate; date <= toDate; date.setDate(i.getDate() + 1)) {
    for (const room of booking) {
      for (let j = 0; j < room.noRooms; j++) {
        const slot = {
          bookingId: booking._id,
          hotelId: booking.hotelId,
          roomId: room.roomId,
          date,
        };
        roomSlots.push(slot);
      }
    }
  }

  await RoomSlotsBooking.insertMany(roomSlots);
};

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user.id });

  return res.json({
    success: true,
    bookings,
  });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.find({ _id: bookingId });
  await validateBooking(booking, req.user.id);

  return res.json({
    success: true,
    booking,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { fromDate, toDate, rooms, hotelId } = req.body;

  // need to validate the booking before
  const price = await validateRoomAvailablity(fromDate, toDate, hotelId, rooms);

  const booking = await Booking.create({
    userId: req.user.id,
    fromDate,
    toDate,
    rooms,
    hotelId,
    price,
    paymentStatus: done,
  });

  // create slots for booked rooms
  await createBookingRoomSlots(booking);

  return res.status(201).status({
    success: true,
    booking,
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.find({ _id: bookingId });
  await validateBooking(booking, req.user.id);

  const updated = await Booking.findOneAndUpdate(
    { _id: booking._id },
    { is_cancelled: true },
    { new: true, runValidators: true }
  );

  // remove documents from RoomSlotBooking
  await RoomSlotsBooking.deleteMany({ bookingId });

  return res.json({
    success: true,
    booking: updated,
  });
});
