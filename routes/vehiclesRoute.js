const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehiclesModel.js');

// GET all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (vehicle == null) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new vehicle
router.post('/', async (req, res) => {
    const vehicle = new Vehicle({
        vehicle_type: req.body.vehicle_type,
        capacity: req.body.capacity,
        availability: req.body.availability,
        loaded: req.body.loaded,
        unloaded: req.body.unloaded
    });

    try {
        const newVehicle = await vehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (Update) a vehicle
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a vehicle
router.delete('/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndRemove(req.params.id);
        res.json({ message: 'Vehicle deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
