const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

router.get('/test', (req, res) => {
    res.send('Route works!');
  });
// Create artist (no token required)
router.post('/', async (req, res) => { // ➖ No middleware
  const artist = new Artist(req.body);
  await artist.save();
  res.status(201).send(artist);
});

// Get all artists (no token required)
router.get('/', async (req, res) => { // ➖ No middleware
  const artists = await Artist.find().populate('albums');
  res.send(artists);
});

// Update artist (no token required)
router.put('/:id', async (req, res) => { // ➖ No middleware
  const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(artist);
});

// Delete artist (no token required)
router.delete('/:id', async (req, res) => { // ➖ No middleware
  await Artist.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;