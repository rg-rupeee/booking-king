const mongoose = require("mongoose");
const Hotel = require("./Hotel");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hotelId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    review: {
      type: String,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.statics.calcAverageRatings = async function (hotelId) {
  const stats = await this.aggregate([
    {
      $match: { hotelId },
    },
    {
      $group: {
        _id: "$hotelId",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.hotelId);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  console.log("post f&u");
  await this.r.constructor.calcAverageRatings(this.r.hotelId);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
