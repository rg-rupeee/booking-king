const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
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
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
  },
  images: [String],
  avgRating: {
    type: Number,
    default: 4.5,
  },
  noRating: {
    type: Number,
    default: 0,
  },
  hotelRules: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  is_published: {
    type: Boolean,
    default: false,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
