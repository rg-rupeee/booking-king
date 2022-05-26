const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const bookingRouter = require("./booking/index");
router.use("/booking", bookingRouter);

module.exports = router;
