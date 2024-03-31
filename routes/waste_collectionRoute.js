const express = require('express');
const router = express.Router();
const WasteCollection = require('../models/waste_collectionModel.js'); 
const Vehicle = require('../models/vehiclesModel.js')
// Create a new Waste Collection entry
router.post('/', async (req, res) => {
    // return res.send(req.body)
    try {
        const newWasteCollection = new WasteCollection(req.body);
        await newWasteCollection.save();
        // res.status(201).json(newWasteCollection);
        res.render("sts_manager.ejs");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/sts_maneger', async (req, res) => {
    req.body.sts_id = req.session.user.sts_id;
    try {
        const newWasteCollection = new WasteCollection(req.body);
        await newWasteCollection.save();
        res.render("sts_manager.ejs");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/sts_maneger', async (req, res) => {
    console.log(req.session.user);
    try {
        // Fetch waste collection data wasteCollectionData
        const wasteCollectionData = await WasteCollection.find({sts_id:req.session.user.sts_id});
        const list = [];
        const combinedData = await Promise.all(wasteCollectionData.map(async (row) => {
            const vehicle = await Vehicle.findOne({_id: row.vehile_id });
            const newData = {};
            newData._id = row._id;
            newData.sts_id = row.sts_id;
            newData.vehile_id = row.vehile_id;
            newData.waste_volume = row.waste_volume;
            newData.arrival_time = row.arrival_time;
            newData.departure_time = row.departure_time;
            newData.__v = row.__v;

            if (vehicle) {
                console.log("Vehicle type found" , vehicle.vehicle_type);
                newData.vehile_type = vehicle.vehicle_type;
                list.push(newData);
                return newData;
            }
        }));
        console.log(list);
        res.json(list); // Send the combined data as a JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
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

router.use('*',(req,res)=>{
    res.send('404! your page is not found');
});


module.exports = router;
