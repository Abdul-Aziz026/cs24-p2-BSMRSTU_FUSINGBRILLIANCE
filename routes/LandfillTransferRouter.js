const express = require('express');
const router = express.Router();
const LandfillTransfer = require('../models/LandfillTransferModel.js');
const isStytemAdmin = require("../systemAdminMiddleware.js");

router.get("/createLandFill", isStytemAdmin, (req, res)=> {
    res.render("landFillCreate.ejs");
});

const Land = require("../models/landFillModel.js");

router.post("/createLandFill", isStytemAdmin, async(req, res)=> {
    // return res.send("come...");
    // return res.send(req.body);
    const newLand = new Land({
        capacity: req.body.capacity,
        gps_location: {
            x: req.body.gps_location_x,
            y: req.body.gps_location_y
        }
    });
    const rest = await newLand.save();
    res.redirect("/myhome");
    // res.send(rest);
});

// Route to create a new landfill transfer entry
router.post('/', async (req, res) => {
    try {
        const { vehicle_id, waste_volume, arrival_time, departure_time } = req.body;
        const newTransfer = new LandfillTransfer({
            vehicle_id,
            waste_volume,
            arrival_time,
            departure_time
        });
        console.log('home',newTransfer)
        const savedTransfer = await newTransfer.save();
        res.redirect("/myhome");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/create',(req,res)=>{
    res.render('createLandfill.ejs');
});

// Route to get all landfill transfer entries
router.get('/', async (req, res) => {
    try {
        const transfers = await LandfillTransfer.find();
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific landfill transfer entry by ID
router.get('/:id', getTransfer, (req, res) => {
    res.json(res.transfer);
});

// Middleware to get a specific landfill transfer entry by ID
async function getTransfer(req, res, next) {
    let transfer;
    try {
        transfer = await LandfillTransfer.findById(req.params.id);
        if (transfer == null) {
            return res.status(404).json({ message: 'Transfer not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.transfer = transfer;
    next();
}

// Route to update a specific landfill transfer entry by ID
router.patch('/:id', getTransfer, async (req, res) => {
    if (req.body.vehicle_id != null) {
        res.transfer.vehicle_id = req.body.vehicle_id;
    }
    if (req.body.landfill_manager != null) {
        res.transfer.landfill_manager = req.body.landfill_manager;
    }
    if (req.body.waste_volume != null) {
        res.transfer.waste_volume = req.body.waste_volume;
    }
    if (req.body.arrival_time != null) {
        res.transfer.arrival_time = req.body.arrival_time;
    }
    if (req.body.departure_time != null) {
        res.transfer.departure_time = req.body.departure_time;
    }
    try {
        const updatedTransfer = await res.transfer.save();
        res.json(updatedTransfer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a specific landfill transfer entry by ID
router.delete('/:id', getTransfer, async (req, res) => {
    try {
        await res.transfer.remove();
        res.json({ message: 'Transfer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
