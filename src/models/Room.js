const mongoose = require("mongoose");

/* It will be the internal data structure - used to allocate slots */
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
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
