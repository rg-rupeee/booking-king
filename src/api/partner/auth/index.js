const express = require("express");
const router = express.Router();

const authController = require("./_controller/authController");
const { requiredFields } = require("../../_util/reqBodyValidator");

router.post(
  "/signup",
  requiredFields("name", "email", "password"),
  authController.emailSignup
);

router.post(
  "/signin",
  requiredFields("email", "password"),
  authController.emailSignin
);

// send forget password otp
router.post(
  "/forgetPassword",
  requiredFields("email"),
  authController.forgetPassword
);

// verify otp and change password
router.post(
  "/resetPassword",
  requiredFields("email", "otp", "password"),
  authController.resetPassword
);

module.exports = router;
