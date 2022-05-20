const express = require("express");
const router = express.Router();

const { protect } = require("../../_util/authMiddlewares");
const { requiredFields } = require("../../_util/reqBodyValidator");
const Partner = require("../../../models/Partner");
const roomController = require("./controller/roomController");

const roomTypeRouter = require("./roomTypeRoutes");
router.use("/type", roomTypeRouter);

/* add - remove rooms */

/* get room details */

module.exports = router;
