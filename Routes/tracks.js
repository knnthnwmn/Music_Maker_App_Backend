const { Tracks, validateTracks } = require("../models/tracksSchema");
const { User, validateUser } = require("../models/userSchema");
const express = require("express");
const router = express.Router();

router.get("/:id/audioFiles", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const audioFiles = user.audioFiles;
    if (!audioFiles)
      return res
        .status(400)
        .send(`The track with id "${req.params.id}" does not exist`);

    return res.send(audioFiles);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


router.get("/:id/audioFiles/:trackId", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return res
          .status(400)
          .send(`The track with id "${req.params.id}" does not exist`);
      const track = user.audioFiles.id(req.params.trackId); 
      console.log(track)
      return res.send(track);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

router.post("/:id/audioFiles", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.id}" does not exist.`);

    const track = new Track({
      description: req.body.description,
      likes: req.body.likes,
      image: req.body.image
    });
    if (!track) return res.status(400).send(`Reply doesnt exist.`);
    user.audioFiles.push(track);
    await user.save();
    return res.send(track);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id/audioFiles/:trackid", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const track = user.audioFiles.id(req.params.trackid);
              track.like= req.body.like,
              track.description= req.body.description
              
      if (!user)
      return res
        .status(400)
        .send(`The track with id "${req.params.trackid}" does not exist.`);

    await user.save();

    return res.send(user.audioFiles.id(req.params.trackid));
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete("/:id/audioFiles/:trackid", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
          "$pull": {
            "audioFiles": {
              "_id": req.params.trackid
            }
          }
        });
    if (!user)
      return res
        .status(400)
        .send(`The track with id "${req.params.trackid}" does not exist.`);

    return res.send(user.audioFiles.id(req.params.trackid));
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});



module.exports = router;
