const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
