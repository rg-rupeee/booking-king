const express = require("express");
const router = express.Router();

const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");
const Partner = require("../../../models/Partner");
const lisitingController = require("./controller/listingController");

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
router.get("/:id", protect(Partner), lisitingController.getListedHotel);

/* update hotel details */
router.patch("/:id", protect(Partner), lisitingController.updateListedHotel);

/* delete hotel */
router.delete("/:id", protect(Partner), lisitingController.deleteListedHotel);

/* create a room type */

/* get all room type */

/* get one room type */

/* update room type */

/* delete room type */

/* create a room */

/* get all a rooms */

/* get a room */

/* update a room */

/* delete a room */

module.exports = router;
