const express = require('express');
const STS = require("../models/stsModel.js");
const router = express.Router();

// POST route to create a new STS entry
router.post('/', async (req, res) => {
    try {
        const newSTS = new STS(req.body);
        const savedSTS = await newSTS.save();
        res.status(201).json(savedSTS);
    } catch (error) {
        console.error('Error saving STS:', error);
        res.status(500).json({ error: 'Could not save STS data' });
    }
});


// GET route to retrieve all STS entries
router.get('/', async (req, res) => {
    try {
        const allSTS = await STS.find();
        res.status(200).json(allSTS);
    } catch (error) {
        console.error('Error retrieving STS data:', error);
        res.status(500).json({ error: 'Could not retrieve STS data' });
    }
});

module.exports = router;
