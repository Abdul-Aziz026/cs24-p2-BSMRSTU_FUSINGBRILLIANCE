const express = require('express');
const router = express.Router();
const WasteCollection = require('../models/waste_collectionModel.js'); 

// Create a new Waste Collection entry
router.post('/', async (req, res) => {
    try {
        const newWasteCollection = new WasteCollection(req.body);
        await newWasteCollection.save();
        res.status(201).json(newWasteCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Waste Collection entries
router.get('/', async (req, res) => {
    try {
        const wasteCollections = await WasteCollection.find();
        res.json(wasteCollections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single Waste Collection entry by ID
router.get('/:id', getWasteCollection, (req, res) => {
    res.json(res.wasteCollection);
});

// Middleware to get Waste Collection entry by ID
async function getWasteCollection(req, res, next) {
    try {
        const wasteCollection = await WasteCollection.findById(req.params.id);
        if (wasteCollection == null) {
            return res.status(404).json({ message: 'Waste Collection entry not found' });
        }
        res.wasteCollection = wasteCollection;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Update a Waste Collection entry
router.patch('/:id', getWasteCollection, async (req, res) => {
    if (req.body.sts_id != null) {
        res.wasteCollection.sts_id = req.body.sts_id;
    }
    if (req.body.vehile_id != null) {
        res.wasteCollection.vehile_id = req.body.vehile_id;
    }
    if (req.body.waste_volume != null) {
        res.wasteCollection.waste_volume = req.body.waste_volume;
    }
    if (req.body.arrival_time != null) {
        res.wasteCollection.arrival_time = req.body.arrival_time;
    }
    if (req.body.departure_time != null) {
        res.wasteCollection.departure_time = req.body.departure_time;
    }
    try {
        const updatedWasteCollection = await res.wasteCollection.save();
        res.json(updatedWasteCollection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a Waste Collection entry
router.delete('/:id', getWasteCollection, async (req, res) => {
    try {
        await res.wasteCollection.remove();
        res.json({ message: 'Waste Collection entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
