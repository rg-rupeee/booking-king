const jwt = require("jsonwebtoken");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { sendMailViaTemplate, sendMail } = require("./email");

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

exports.emailSignin = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      return next(new AppError("Please provide email"));
    }
    if (!password) {
      return next(new AppError("Please provide password"));
    }

    const user = await Model.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("User does not exists", 400));
    }

    console.log({ user, password });

    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Invalid Password", 401));
    }

    createSendToken(user, 200, req, res);
  });

exports.emailSignup = (Model) =>
  catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await Model.findOne({ email });

    if (user) {
      return next(new AppError(`user already exists`, 400));
    }

    const newUser = await Model.create({ name, email, password });

    await sendMail(
      { name, email },
      "Welcome to Booking King",
      `<h3>Welcome ${name}!</h3> <div><br> <b>Hope you have wonderful Booking here</b></div>`
    );

    createSendToken(newUser, 201, req, res);
  });

exports.forgetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await Model.findOne({ email });

    if (!user) {
      return next(new AppError(`No user exists with email: ${email}`, 400));
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const passwordResetExpires = Date.now() + 60 * 60 * 60;

    await Model.findOneAndUpdate(
      { _id: user._id },
      {
        passwordResetOTP: otp,
        passwordResetExpires,
        passwordResetAttempts: 0,
      }
    );

    // send mail
    await sendMail(
      { name: user.name, email },
      "Password Reset Token",
      `<p>Your Password Reset code is <b>${otp}</b><p><br><p><i>The OTP is valid only for 10 minutes</i></p>`
    );

    return res.json({
      success: true,
      message: "OTP sent on mail",
    });
  });

exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email, password, otp } = req.body;

    const user = await Model.findOne({ email });

    console.log(user);

    if (!user) {
      return next(new AppError(`No user exists with email: ${email}`, 400));
    }

    const userPasswordResetOTP = user.passwordResetOTP
      ? user.passwordResetOTP
      : 0;

    const userPaswordResetExpires = user.passwordResetExpires
      ? user.passwordResetExpires
      : 0;

    const userPassswordResetAttempts = user.passwordResetAttempts
      ? user.passwordResetAttempts
      : 0;

    if (userPasswordResetOTP == otp) {
      if (userPaswordResetExpires < Date.now()) {
        return res.status(401).json({
          success: false,
          status: "fail",
          message: "OTP expired",
        });
      }

      user.password = password;
      user.passwordResetOTP = undefined;
      await user.save();
    } else {
      if (userPassswordResetAttempts > 5) {
        await Model.findOneAndUpdate(
          { _id: user._id },
          {
            $unset: { passwordResetOTP: 1 },
          }
        );
        return res.status(400).json({
          success: false,
          status: "fail",
          message: "Invalid OTP. Password reset attemp exeeded!!!",
        });
      } else {
        await Model.findOneAndUpdate(
          { _id: user._id },
          {
            passwordResetAttempts: userPassswordResetAttempts + 1,
          }
        );
        return res.status(400).json({
          success: false,
          status: "fail",
          message: "invalid otp",
        });
      }
    }

    createSendToken(user, 200, req, res);
  });

exports.changePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await Model.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(oldPassword, user.password))) {
      return next(new AppError("Invalid Password", 401));
    }

    // need to use .save() so that pre save middleware executes and hashing of password is done
    user.password = newPassword;
    await user.save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      user,
    });
  });
