const mongoose = require("mongoose");
const Joi = require("joi");
const fileUpload = require("../middleware/fileUpload");

const trackSchema = new mongoose.Schema({
  audioFiles: { type: String, default:"", required: true},
});

const Track = mongoose.model("Track", trackSchema);

function validateTrack(track) {
  const schema = Joi.object({
    audioFiles: Joi.object().required(),
  });
  return schema.validate(track);
}

exports.Track = Track;
exports.validateTrack = validateTrack;
exports.trackSchema = trackSchema;
