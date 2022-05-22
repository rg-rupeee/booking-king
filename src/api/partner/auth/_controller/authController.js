const Partner = require("../../../../models/Partner");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/authHandlers");

exports.emailSignin = emailSignin(Partner);

exports.emailSignup = emailSignup(Partner);

exports.forgetPassword = forgetPassword(Partner, "partner");

exports.resetPassword = resetPassword(Partner);
