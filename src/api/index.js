const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes/index");
router.use("/user", userRouter);

const partnerRouter = require("./partnerRoutes/index");
router.use("/partner", partnerRouter);

const hotelRouter = require("./hotelRoutes/index");
router.use("/hotel", hotelRouter);

router.use("/test", (req, res, next) => {
  res.json({
    success: true,
    message: "Hello from server",
  });
});

module.exports = router;
