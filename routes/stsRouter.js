const express = require('express');
const STS = require("../models/stsModel.js");
const router = express.Router();

const systemAdmin = require("../systemAdminMiddleware.js");

router.get("/createSts", systemAdmin, (req, res)=>{
    res.render("createSts.ejs");
});

// POST route to create a new STS entry
router.post('/', async (req, res) => {
    // return res.send("comeeeeee");
    try {
        // res.send(req.body);
        const newSTS = new STS({
            ward_no: req.body.ward_no,
            capacity: req.body.capacity,
            gps_location: {
                x: req.body.gps_location_x,
                y: req.body.gps_location_y
            },
            sts_mgr_id: req.body.sts_mgr_id
        });
    
        newSTS.sts_id = newSTS._id;
        // return res.send(newSTS);
        // return res.send(newSTS);
        const savedSTS = await newSTS.save();

        res.redirect("/myhome");
        // res.status(201).json(savedSTS);
    } catch (error) {
        console.log(error.message);
        const success = 0;
        const alert = "Sts Create failed..!!!";
        return res.render("alert.ejs", {alert, success});
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
