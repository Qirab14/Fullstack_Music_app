const express = require('express');
const router = express.Router();
const Album = require('../models/Album');


// Create a new album
router.post('/',  async (req, res) => {
    const album = new Album(req.body);
    await album.save();
    res.status(201).send(album);
});

// Get all albums
router.get('/',  async (req, res) => {
    const albums = await Album.find().populate('artist');
    res.send(albums);
});

// Update an album
router.put('/:id',  async (req, res) => {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(album);
});

// Delete an album
router.delete('/:id',  async (req, res) => {
    await Album.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

module.exports = router;