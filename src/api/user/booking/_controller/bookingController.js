const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");
const apiFeatures = require("../../../_util/apiFeatures");

const Booking = require("../../../../models/Booking");
const Room = require("../../../../models/Room");
const RoomSlotsBooking = require("../../../../models/RoomSlotsBooking");

const validateBooking = async (booking, userId) => {
  console.log(booking);
  if (!booking) {
    throw new AppError("No booking found with that id", 404);
  }

  if (!booking.userId.equals(userId)) {
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

  return room;
};

const getBookingCost = async (fromDate, toDate, hotelId, rooms) => {
  const FromDate = new Date(fromDate);
  const ToDate = new Date(toDate);

  if (FromDate > ToDate) {
    throw new AppError("toDate cannot be less than from Date", 400);
  }

  const noDays = parseInt((ToDate - FromDate) / (1000 * 60 * 60 * 24));
  console.log(noDays);

  let price = 0;
  for (const room of rooms) {
    if (!room.roomId) {
      throw new AppError("room must have roomId", 400);
    }
    if (!room.noRooms) {
      room.noRooms = 1;
    }

    const hotelRoom = await getRoom(hotelId, room.roomId);

    console.log(hotelRoom);

    price = price + hotelRoom.price * room.noRooms;
  }

  price = price * noDays;

  return price;
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
  const features = new apiFeatures(
    Booking.find({ userId: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  return res.json({
    success: true,
    bookings,
  });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  if (req.query && req.query.fields) {
    const fields = req.query.fields.split(",");
    if (!fields.includes("userId")) {
      req.query.fields = req.query.fields + ",userId";
    }
  }

  const features = new apiFeatures(
    Booking.findOne({ _id: bookingId }),
    req.query
  ).limitFields();

  const booking = await features.query;
  await validateBooking(booking, req.user.id);

  return res.json({
    success: true,
    booking,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { fromDate, toDate, rooms, hotelId } = req.body;

  // need to validate the booking before
  const price = await getBookingCost(fromDate, toDate, hotelId, rooms);

  console.log(price);

  const booking = await Booking.create({
    userId: req.user.id,
    fromDate,
    toDate,
    rooms,
    hotelId,
    price,
    paymentStatus: "Done",
  });

  // create slots for booked rooms
  // await createBookingRoomSlots(booking);

  console.log("hello");

  return res.status(201).json({
    success: true,
    booking,
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.findOne({ _id: bookingId });
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
