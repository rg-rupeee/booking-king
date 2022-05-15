const express = require("express");
const router = express.Router();

const userRoutes = require("./user/index");
router.use("/user", userRoutes);

router.use("/test", (req, res, next) => {
  res.json({
    success: true,
    message: "Hello from server",
  });
});

module.exports = router;
