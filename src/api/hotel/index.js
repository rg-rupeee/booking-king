const express = require("express");
const router = express.Router();

const hotelController = require("./_controller/hotelController");
const { requiredFields } = require("./../_util/reqBodyValidator");

const reviewRouter = require("./review/index");
router.use("/:hotelId/reviews", reviewRouter);

/* get nearby hotels */
router.get("/nearby/:lat/:long", hotelController.getNearbyHotels);

/* search hotels - regex */
router.post(
  "/search",
  requiredFields("searchKey"),
  hotelController.searchHotels
);

/* get single hotel */
router.get("/:id", hotelController.getHotel);

/* get hotel rooms */
router.get("/:hotelId/rooms", hotelController.getHotelRooms);

/* get hotel - rooms availablity */
router.get(
  "/:hotelId/rooms/availablity",
  requiredFields("date"),
  hotelController.getHotelRoomsAvailablity
);

/* get all hotels */
router.get("/", hotelController.getAllHotels);

module.exports = router;
