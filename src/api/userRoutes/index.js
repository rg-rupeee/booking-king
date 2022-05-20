const express = require("express");
const router = express.Router();

const authRouter = require("./authRoutes/index");
router.use("/auth", authRouter);

module.exports = router;
