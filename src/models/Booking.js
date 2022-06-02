const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotelId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rooms: [
    {
      roomId: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      noRooms: {
        type: Number,
        required: true,
      },
    },
  ],
  fromDate: {
    type: Date,
    ref: "User",
    required: true,
  },
  toDate: {
    type: Date,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Done"],
  },
  is_cancelled: {
    type: Boolean,
    default: false,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
