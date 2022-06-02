const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("./_controller/reviewController");
const User = require("../../../models/User");
const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");

/* get all hotel reviews */
router.get("/", reviewController.getReviews);

/* create a review */
router.post(
  "/",
  protect(User),
  requiredFields("rating", "review"),
  reviewController.addReview
);

/* edit a review */
router.patch("/:reviewId", protect(User), reviewController.updateReview);

/* delete a review */
router.delete("/:reviewId", protect(User), reviewController.deleteReview);

module.exports = router;
