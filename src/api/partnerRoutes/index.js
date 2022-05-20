const express = require("express");
const router = express.Router();

const authRouter = require("./authRoutes/index");
router.use("/auth", authRouter);

const listingRouter = require("./listingRoutes/index");
router.use("/listing", listingRouter);

module.exports = router;
