const express = require("express");
const router = express.Router();

const userRouter = require("./user/index");
router.use("/user", userRouter);

const partnerRouter = require("./partner/index");
router.use("/partner", partnerRouter);

const hotelRouter = require("./hotel/index");
router.use("/hotel", hotelRouter);

router.use("/test", (req, res, next) => {
  res.json({
    success: true,
    message: "Hello from server",
  });
});

module.exports = router;
