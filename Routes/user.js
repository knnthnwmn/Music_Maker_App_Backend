const { User, validateUser, validateLogin } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const fileUpload = require("../middleware/fileUpload");
const { Track, validateTrack } = require("../models/tracksSchema");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(400)
        .send(`The product with id "${req.params.id}" does not exist`);

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/", fileUpload.single("audio"), async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    const salt = await bcrypt.genSalt(10);
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    });
    // const track = new Track({
    //   audioFiles: req.file.path,
    // });
    // user.audioFiles.push(track);
    await user.save();

    let token;
    try {
      token = user.generateAuthToken();
    } catch (error) {
      return res.status(540).send(`Generate Auth Internal error: ${error}`);
    }
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.id}" does not exist.`);

    await user.save();
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      config.get("jwtsecret")
    );
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id/mixes", [fileUpload.single("audio")], async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    if (!user)
    return res
    .status(400)
    .send(`The user with id "${req.params.id}" does not exist.`);
    
    const track = new Track({
      audio: req.file.path,
    });
    user.audioFiles.push(track);
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        audioFiles: user.audioFiles,
      },
      config.get("jwtsecret")
    );
    await user.save();
    return res.send(token);
    // return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.id}" does not exist.`);

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/:id/posts", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.id}" does not exist.`);

    const post = new Post({
      description: req.body.description,
      likes: 0,
    });
    if (!post) return res.status(400).send(`Reply doesnt exist.`);
    user.posts.push(post);
    await user.save();
    return res.send(post);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        audioFiles: user.audioFiles,
        id: user._id,
      },
      config.get("jwtsecret")
    );
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
