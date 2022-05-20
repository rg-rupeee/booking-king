const express = require("express");
const router = express.Router();

const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");
const Partner = require("../../../models/Partner");
const roomTypeController = require("./controller/roomTypeController");

/* create a room type */
router.post(
  "/",
  protect(Partner),
  requiredFields("hotelId", "name", "price"),
  roomTypeController.createRoomType
);

/* get all room type */
router.get("/", protect(Partner), roomTypeController.getAllRoomTypes);

/* get one room type */
router.get("/:id", protect(Partner), roomTypeController.getRoomType);

/* update room type */
router.patch("/:id", protect(Partner), roomTypeController.updateRoomType);

/* delete room type */
router.delete("/:id", protect(Partner), roomTypeController.deleteRoomType);

module.exports = router;
