const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  return isPasswordMatch;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
