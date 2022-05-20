const User = require("../../../../models/User");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/authHandlers");

exports.emailSignin = emailSignin(User);

exports.emailSignup = emailSignup(User);

exports.forgetPassword = forgetPassword(User, "user");

exports.resetPassword = resetPassword(User);
