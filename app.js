const mongoose = require("mongoose");
const express = require('express')
const app = express();



const session = require("express-session");
const flash = require("connect-flash");
app.use(flash());


const bodyParser = require('body-parser');
require("./databaseConCheck.js");
// boilerplate includer
const ejsMate = require('ejs-mate');
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

const path = require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// for serving public folder css file all place
app.use(express.static(path.join(__dirname, "/public")));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));


const WasteCollection = require("./models/waste_collectionModel.js");
const StsCollection = require("./models/stsModel.js");
const vehicleCollection = require("./models/vehiclesModel.js");

// Define middleware to set LoggedIn variable
app.use((req, res, next) => {
    res.locals.LoggedIn = true;
    res.locals.roles = 1;
    next();
});

app.get('/profile',(req,res)=>{
    const user = req.session.user;
    // return res.send(user);
    res.render('profile.ejs' , {user});
});

app.get("/home", async(req, res)=>{
    // res.render("dashBoard.ejs");
    const totWaste = await WasteCollection.find();
    let totalWaste = 0, totalFuel = 0, totalCost = 0;
    for (waste of totWaste) {
        totalWaste += waste.waste_volume;
        const sts = await StsCollection.findOne({sts_id: waste.sts_id});
        if (sts && sts.length > 0) {
            console.log(sts);
            let curDist = sts.gps_location.x + sts.gps_location.y ;
            totalFuel += curDist;
        }
        const vehicle = await vehicleCollection.findById(sts.vehile_id);
        console.log("vehicle : ", vehicle);
        let curCost = 1;
        if (vehicle && vehicle.length > 0) {
            curCost = 0;
            if (vehicle.vehicle_type==="Truck") {
                // 3 ton
                curCost += vehicle.unloaded + (3/5) * (vehicle.loaded - vehicle.unloaded) * 3;
            }
            else if (vehicle.vehicle_type=="Compactor") {
                // 7 ton
                curCost += vehicle.unloaded + (3/5) * (vehicle.loaded - vehicle.unloaded) * 7;
            }
            else {
                // 5 ton
                curCost += vehicle.unloaded + (3/5) * (vehicle.loaded - vehicle.unloaded) * 5;
            }
        }
        totalCost += curCost * curDist;
    }
    
    res.render("dash.ejs", {totalWaste, totalFuel, totalCost});
});

// const mailsend= require('./routes/emailJsRoute.js');
// app.use("/user", mailsend);

// const mailSendRoute = require("./routes/emailSendRouter.js");
// app.use('/user', mailSendRoute);

// //user route...
const UserRoute = require('./routes/userRoutes.js');
app.use('/auth' , UserRoute);

// vehicle route....
const vehicleRoute = require('./routes/vehiclesRoute.js');
app.use('/vehicles', vehicleRoute);

const userRoute = require("./routes/userRoute.js");
app.use("/users", userRoute);

// sts route....
const stsRoutes = require('./routes/stsRouter.js');
app.use('/sts', stsRoutes);

// waste collection route....
const wasteCollectionRoute = require('./routes/waste_collectionRoute.js');
app.use('/waste_collection', wasteCollectionRoute);

// Landfill transfar route....
const LandfillTransferRoute = require('./routes/LandfillTransferRouter.js');
app.use('/landfill_transfer', LandfillTransferRoute);

app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch.....