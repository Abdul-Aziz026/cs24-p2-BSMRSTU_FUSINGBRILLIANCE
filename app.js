const mongoose = require("mongoose");
const express = require('express')
const app = express();



const session = require("express-session");
const flash = require("connect-flash");
app.use(flash());
app.use(express.json());


const bodyParser = require('body-parser');
require("./databaseConCheck.js");
// boilerplate includer
const ejsMate = require('ejs-mate');
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const path = require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// for serving public folder css file all place
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

// app.use('/users/:userId/p', (req, res) => {
//     // return res.send("okkk");

//     const userId = req.params.userId; // Get the userId from URL parameter
//     const { name, email } = req.query; // Get name and email from query parameters
//     console.log(name, email);
//     // Perform any necessary validation or processing here
//     // For now, let's just send back a response with the received data
//     res.json({ userId, name, email });
// });


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));



const WasteCollection = require("./models/waste_collectionModel.js");
const StsCollection = require("./models/stsModel.js");
const vehicleCollection = require("./models/vehiclesModel.js");
const User = require("./models/userModel");

// Define middleware to set LoggedIn variable
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.LoggedIn = true;
        res.locals.roles = 1;
    }
    else {
        res.locals.LoggedIn = false;
        res.locals.roles = 0;
    }
    next();
});


const isStytemAdmin = require("./systemAdminMiddleware.js");

const isLogged = require("./loggedInMiddleware.js");

app.get("/users/edit/:role_id", isLogged, async(req, res)=>{
    const role_id = req.params.role_id;
    const user = await User.findOne({ _id: role_id });
    return res.render("editProfile.ejs",{user});
});

app.get("/profile", isLogged, (req, res)=>{
    const user = req.session.user;
    res.render("personalProfile.ejs", {user});
});

app.get('/upd_profile',(req,res)=>{
    const user = req.session.user;
    // return res.send(user);
    res.render('profile.ejs' , {user});
});
const homeAccess = require("./homePageAccessMiddleWare.js");
app.get("/home", homeAccess, async(req, res)=>{
    // res.render("dashBoard.ejs");
    const totWaste = await WasteCollection.find();
    let totalWaste = 0, totalFuel = 0, totalCost = 0;
    for (waste of totWaste) {
        totalWaste += waste.waste_volume;
        const sts = await StsCollection.findOne({sts_id: waste.sts_id});
        let curDist = 1;
        if (sts && sts.length > 0) {
            curDist = 0;
            console.log(sts);
            curDist = sts.gps_location.x + sts.gps_location.y ;
        }
        totalFuel += curDist;
        const vehicle = await vehicleCollection.findById(sts.vehile_id);
        // console.log("vehicle : ", vehicle);
        let curCost = 1;
        if (vehicle && vehicle.length > 0) {
            curCost = 0;
            if (vehicle.vehicle_type==="Truck") {
                // 3 ton
                curCost += vehicle.unloaded + (3/5.0) * (vehicle.loaded - vehicle.unloaded) * 3;
            }
            else if (vehicle.vehicle_type=="Compactor") {
                // 7 ton
                curCost += vehicle.unloaded + (3/5.0) * (vehicle.loaded - vehicle.unloaded) * 7;
            }
            else if (vehicle.vehicle_type=="Dump Truck"){
                // 5 ton
                curCost += vehicle.unloaded + (3/5.0) * (vehicle.loaded - vehicle.unloaded) * 5;
            }
            else {
                curCost += vehicle.unloaded + (3/5.0) * (vehicle.loaded - vehicle.unloaded) * 15;
            }
        }
        totalCost += curCost * curDist;
    }
    
    res.render("dash.ejs", {totalWaste, totalFuel, totalCost});
});


// const isStsManager = require("../stsManagerMiddleware.js");
app.get("/myhome", (req, res)=>{
    const user = req.session.user;
    if (!user) return res.redirect("/auth/login");
    
    if (user.role == 1) {
        res.render("systemAdmin.ejs");
        // res.redirect("/home");
    }
    else if (user.role == 2) {
        res.render("sts_manager.ejs");
        // res.redirect("/home");
    }
    else if (user.role == 3) {
        res.render("landFillManager.ejs");
        // res.redirect("/home");
    }
    else {
        res.redirect("/profile");
        // res.redirect("/home");
    }
});

// const mailsend= require('./routes/emailJsRoute.js');
// app.use("/user", mailsend);

// const mailSendRoute = require("./routes/emailSendRouter.js");
// app.use('/user', mailSendRoute);

// //user route...
const UserRoute = require('./routes/userRoutes.js');
app.use('/auth' , UserRoute );

// vehicle route....
const vehicleRoute = require('./routes/vehiclesRoute.js');
app.use('/vehicles', vehicleRoute);

const userRoute = require("./routes/userRoute.js");
app.use("/users", isStytemAdmin, userRoute);

// sts route....
const stsRoutes = require('./routes/stsRouter.js');
app.use('/sts', stsRoutes);

// waste collection route....
const wasteCollectionRoute = require('./routes/waste_collectionRoute.js');
app.use('/waste_collection', wasteCollectionRoute);

// Landfill transfar route....
const LandfillTransferRoute = require('./routes/LandfillTransferRouter.js');
app.use('/landfill_transfer', LandfillTransferRoute);
app.use('*',(req,res)=>{
    res.send('404! your page is not found');
});

app.listen(8000, () => {
    console.log('8000 page listen')
})
//aziz_branch.....