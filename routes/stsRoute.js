const express = require('express');
const router = express.Router();
const YourTableName = require('../models/stsModel.js');

// POST route to create a new entry
router.post('/', async (req, res) => {
    try {
        const { word_no, capacity, gps_location, sts_manager } = req.body;

        // Check if the gps_location is provided in the correct format
        if (!gps_location || !gps_location.x || !gps_location.y) {
            return res.status(400).json({ message: "GPS location (x, y) is required and must be provided in the correct format." });
        }

        const newEntry = new YourTableName({
            word_no,
            capacity,
            gps_location,
            sts_manager
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const entries = await YourTableName.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;