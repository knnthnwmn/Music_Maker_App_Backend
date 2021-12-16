const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  userId: { type: String },
  picture: { type: String },
  description: { type: String, required: true, minlength: 5, maxlength: 50 },
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    // picture: Joi.object().require(),
    description: Joi.string().required(),
    likes: Joi.number(),
  });
  return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;
