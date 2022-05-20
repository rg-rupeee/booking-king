const express = require("express");
const router = express.Router();

const hotelController = require("./controller/hotelController");

/* get all hotels */
router.get("/", hotelController.getAllHotels);

/* get nearby hotels */
router.get("/nearby/:lat/:long", hotelController.getNearbyHotels);

/* search hotels - regex */
router.post("/search", hotelController.searchHotels);

/* get single hotel */
router.get("/:id", hotelController.getHotel);

/* get single hotel - rooms and slots availablity */
router.get("/:id/availablity", hotelController.getHotelRoomsAvailablity);

module.exports = router;
