const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  facilities: [
    {
      type: String,
    },
  ],
  maxPerson: {
    type: String,
    default: 2,
  },
  price: {
    type: Number,
    required: true,
  },
  noRooms: {
    type: Number,
    default: 1,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
