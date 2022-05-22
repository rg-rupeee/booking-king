const express = require("express");
const router = express.Router();

const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");
const Partner = require("../../../models/Partner");
const lisitingController = require("./_controller/listingController");
const roomController = require("./_controller/roomController");

/* list hotel */
router.post(
  "/",
  protect(Partner),
  requiredFields(
    "name",
    "description",
    "country",
    "state",
    "city",
    "address",
    "coordinates",
    "images"
  ),
  lisitingController.listHotel
);

/* get listed hotels */
router.get("/", protect(Partner), lisitingController.getListedHotels);

/* get listed hotel */
router.get("/:hotelId", protect(Partner), lisitingController.getListedHotel);

/* update hotel details */
router.patch(
  "/:hotelId",
  protect(Partner),
  lisitingController.updateListedHotel
);

/* delete hotel */
router.delete(
  "/:hotelId",
  protect(Partner),
  lisitingController.deleteListedHotel
);

/* create room */
router.post(
  "/:hotelId/room",
  protect(Partner),
  requiredFields("name", "description", "price"),
  roomController.createRoom
);

/* get all hotel rooms */
router.get("/:hotelId/room", protect(Partner), roomController.getAllRooms);

/* get one room */
router.get("/:hotelId/room/:roomId", protect(Partner), roomController.getRoom);

/* update room */
router.patch(
  "/:hotelId/room/:roomId",
  protect(Partner),
  roomController.updateRoom
);

/* delete room */
router.delete(
  "/:hotelId/room/:roomId",
  protect(Partner),
  roomController.deleteRoom
);

module.exports = router;
