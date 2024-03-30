const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/userModel');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Parse JSON bodies for this application

const nodemailer = require('nodemailer');


// emailInput Take route for change password...
router.get('/reset-password/initiate', (req, res)=>{
    res.render("emailInput.ejs");
});

// send email Route...
router.get('/reset-password/confirm', async(req, res)=>{
    const {email} = req.query;
    console.log(email);
    // return res.send("come params ");
    // set this sendMail otp as null...
    // const updatedUser = await User.findOneAndUpdate(
    //     { email: req.body.email }, // Filter: find user by email
    //     { otp: "....." }, // Update: set the new OTP
    //     { new: true } // Options: return the updated document
    // );

    // res.send(req.body.email);
    // first send mail 
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        // host: "smtp.ethereal.email",
        // service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    function generateRandomString() {
        const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < 6; i++) {
            randomString += s.charAt(Math.floor(Math.random() * s.length));
        }
        return randomString;
    }
    const otp = generateRandomString();
    console.log("Generated Random String:", otp);
    // req.locals.OTP = otp;
    // console.log(req.)

    const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Filter: find user by email
        { otp: otp }, // Update: set the new OTP
        { new: true } // Options: return the updated document
    );
    
    const toEmail = email;
    // const toEmail = "azizurcsebsmrstu@gmail.com" ;
    console.log(email, process.env.EMAIL_USERNAME);
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // Sender address
        to: toEmail, // List of recipients
        subject: 'Password Reset OTP', // Subject line
        text: `Your OTP code is ${otp}` // Plain text body
    };
    
    // transport.sendMail(mailOptions, function(err, info) {
    //     if (err) {
    //         console.log("error is => " + err.message);
    //     } else {
    //         console.log("send mail successfully!");
    //     }
    // });


    // then otp input form render...
    res.render("passwordAndOtpTakenForm.ejs");
});

router.post("/reset-password/confirm", async(req, res)=>{
    console.log(req.body.otp, req.body.email, req.body.email);
    // res.send(req.body.otp);
    let user = await User.findOne({email: req.body.email});
    console.log(user);
    // const otp = req.body.otp;
    if (req.body.otp == user.otp) {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findOneAndUpdate(
            { email: req.body.email }, // Filter: find user by email
            { password: hashedPassword }, // Update: set the new OTP
            { new: true } // Options: return the updated document
        );
        return res.redirect("/home");
    }
    else {
        // alert("Failed!");
        res.redirect('/auth/login');
    }
});

router.get("/change-password", (req, res)=>{
    res.render("changePassword.ejs");
});

router.post("/change-password", async(req, res)=> {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
        { email: req.body.email }, // Filter: find user by email
        { password: hashedPassword }, // Update: set the new OTP
        { new: true } // Options: return the updated document
    );
    req.session.user = updatedUser;
    res.redirect("/profile");
    // return res.send(updatedUser);
    // res.send("updated password");
})


router.get('/registration', async(req, res)=>{
    res.render("registrationForm.ejs");
});

router.post('/registration', async (req, res) => {
    // console.log(req.body);
    // return res.send(req.body);
    try {
        const { name, password, email, role=4 } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            password: hashedPassword,
            email: email,
            role: role
        });
        const result = await newUser.save();
        // res.status(201).json(result);
        
        res.status(201).send(result);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Registration failed');
    }
});

router.get('/login', async(req, res)=>{
    // return res.send("ok");
    res.render("loginForm.ejs");
});


router.post('/login', async (req, res) => {
    // return res.send("working...");
    // console.log(req.body);
    // return res.send(req.body);
    try {
        const { name, password } = req.body;
        console.log(req.body.name);
        const user = await User.findOne({ name: name });
        // const user = await User.find();
        // console.log(user);
        // return res.send('got');
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        
        res.locals.LoggedIn = true;
        res.locals.email = user.email;
        req.session.user = user;
        console.log("user = ", user);
        console.log("end.......");
        // console.log("what happen");
        // return res.redirect("/home");
        // res.status(200).json({ token });
        if (user.role == 1) {
            // console.log(1, user.role);
            res.render("systemAdmin.ejs");
            // res.redirect("/home");
            // res.send("system Admin");
        }
        else if (user.role == 2) {
            // res.render("systemAdmin.ejs");
            // console.log(2, user.role);
            // res.redirect("/home");
            res.render("sts_manager.ejs");
            // res.redirect("/home");
            // res.send("STS Manager Page");
            // res.render('sts_manager.ejs',  {user});
        }
        else if (user.role == 3) {
            res.render("landFillManager.ejs");
            // res.redirect("/home");
        }
        else {
            res.redirect("/profile");
            // res.redirect("/home");
        //     req.session.user = user;
        //     res.render('unassigned.ejs',  {user});
        }
    } catch (error) {
        res.status(500).send('Login failed');
    }
});


router.get('/logout', async(req, res)=>{
    req.session.user = null;
    // return res.send("ok");
    res.redirect("/home");
});


router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/:role_id', async (req, res) => {
    try {
        const role_id = req.params.role_id;
        const user = await User.findOne({ _id: role_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, password, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, {
            name: name,
            password: password,
            email: email,
            role: role
        }, { new: true }); 

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;