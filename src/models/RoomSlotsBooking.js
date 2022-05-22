const mongoose = require("mongoose");

const roomSlotsBookingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const RoomSlotsBooking = mongoose.model(
  "RoomSlotsBooking",
  roomSlotsBookingSchema
);

module.exports = RoomSlotsBooking;
