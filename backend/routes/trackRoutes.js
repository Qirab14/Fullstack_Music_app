const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Album = require('../models/Album');

// Create a new track (with artist/album validation)
router.post('/', async (req, res) => {
    try {
      const { title, duration, artist, album } = req.body;
  
      // Validate ID format first
      if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).json({ message: 'Invalid Artist ID format' });
      }
  
      // Check artist existence
      const artistExists = await Artist.exists({ _id: artist });
      if (!artistExists) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      // Check album existence
      const albumExists = await Album.exists({ _id: album });
      if (!albumExists) {
        return res.status(404).json({ message: 'Album not found' });
      }
  
      // Create track
      const track = new Track({ title, duration, artist, album });
      await track.save();
      
      res.status(201).json(track);
    } catch (error) {
      console.error('Track creation error:', error);
      res.status(400).json({ 
        message: 'Error creating track',
        error: error.message 
      });
    }
  });

// Get all tracks with populated data
router.get('/', async (req, res) => {
    try {
        const tracks = await Track.find()
            .populate('artist', 'name genre')
            .populate('album', 'title releaseYear');
        
        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Update a track
router.put('/:id', async (req, res) => {
    try {
        const track = await Track.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!track) return res.status(404).json({ message: 'Track not found' });
        res.status(200).json(track);
    } catch (error) {
        console.error('Error updating track:', error);
        res.status(400).json({ 
            message: 'Error updating track', 
            error: error.message 
        });
    }
});

// Delete a track
router.delete('/:id', async (req, res) => {
    try {
        const track = await Track.findByIdAndDelete(req.params.id);
        if (!track) return res.status(404).json({ message: 'Track not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Toggle favorite status
router.patch('/:id/favorite', async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) return res.status(404).json({ message: 'Track not found' });

        track.favorite = !track.favorite;
        await track.save();
        res.status(200).json(track);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

module.exports = router;