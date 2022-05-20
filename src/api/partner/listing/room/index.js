const express = require("express");
const router = express.Router();

const { protect } = require("../../../_util/authMiddlewares");
const { requiredFields } = require("../../../_util/reqBodyValidator");
const Partner = require("../../../../models/Partner");
const roomController = require("./_controller/roomController");

/* create a room */
router.post(
  "/",
  protect(Partner),
  requiredFields("hotelId", "name", "price"),
  roomController.createRoom
);

/* get all rooms */
router.get("/", protect(Partner), roomController.getAllRooms);

/* get one room */
router.get("/:id", protect(Partner), roomController.getRoom);

/* update room */
router.patch("/:id", protect(Partner), roomController.updateRoom);

/* delete room */
router.delete("/:id", protect(Partner), roomController.deleteRoom);

module.exports = router;
