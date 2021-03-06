const mongoose = require("mongoose");
const Joi = require("joi");
const fileUpload = require("../middleware/fileUpload");
const { trackSchema } = require("./tracksSchema");
const jwt = require("jsonwebtoken"); 
const config = require("config")


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, maxlength: 200, minlength: 5 },
  audioFiles: { type: [trackSchema], default: [] }, 
  isAdmin: { type: Boolean, default: false }, 
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin,
      audioFiles: this.audioFiles
    },
    config.get("jwtsecret")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

const validateLogin = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};

exports.User = User;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
