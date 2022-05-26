const express = require("express");
const router = express.Router();

const bookingController = require("./_controller/bookingController");
const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");
const User = require("../../../models/User");

/* see all previous booking */
router.get("/", protect(User), bookingController.getAllBookings);

/* get booking details */
router.get("/:bookingId", protect(User), bookingController.getBookingById);

/* create booking */
router.post(
  "/",
  protect(User),
  requiredFields("fromDate", "toDate", "rooms"),
  bookingController.createBooking
);

/* cancel a booking */
router.delete("/:bookingId", protect(User), bookingController.cancelBooking);

module.exports = router;
