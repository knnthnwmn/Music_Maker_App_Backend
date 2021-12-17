const mongoose = require("mongoose");
const Joi = require("joi");
const fileUpload = require("../middleware/fileUpload");

const tracksSchema = new mongoose.Schema({
  audio: { type: fileUpload },
 description: { type: String, required: true, minlength: 5, maxlength: 50 },

});

const Tracks = mongoose.model("Tracks", tracksSchema);

function validateTracks(tracks) {
  const schema = Joi.object({
    audio: Joi.object().require(),
    description: Joi.string().required(),
  });
  return schema.validate(tracks);
}

exports.Tracks = Tracks;
exports.validateTracks = validateTracks;
exports.tracksSchema = tracksSchema;
