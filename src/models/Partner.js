const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    select: false,
  },
  passwordResetOTP: Number,
  passwordResetExpires: Date,
  passwordResetAttempts: Number,
});

partnerSchema.pre("save", async function (next) {
  // If password is not modified return
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

partnerSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

partnerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const partner = mongoose.model("Partner", partnerSchema);

module.exports = partner;
