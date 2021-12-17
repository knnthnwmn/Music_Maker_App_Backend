const mongoose = require("mongoose");
const Joi = require("joi");
const fileUpload = require("../middleware/fileUpload");

const trackSchema = new mongoose.Schema({
  audio: { type: String, default:"", required: true},
 description: { type: String, minlength: 5, maxlength: 50, default:""},
});

const Track = mongoose.model("Track", trackSchema);

function validateTrack(track) {
  const schema = Joi.object({
    audio: Joi.object().required(),
    description: Joi.string(),
  });
  return schema.validate(track);
}

exports.Track = Track;
exports.validateTrack = validateTrack;
exports.trackSchema = trackSchema;
