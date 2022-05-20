const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const listingRouter = require("./listing/index");
router.use("/listing", listingRouter);

module.exports = router;
