const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/userModel');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Parse JSON bodies for this application


router.get('/forget', (req, res)=>{
    res.render("forget.ejs");
});

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
        
        res.status(201).send('User registered successfully');
    } catch (err) {
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
        const { username, password } = req.body;
        console.log(req.body.username);
        const user = await User.findOne({ name: username });
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
        // res.status(200).json({ token });
        if (user.role == 1) {
            res.send("system Admin");
        }
        if (user.role == 2) {
            res.send("STS Manager Page");
        }
        if (user.role == 3) {
            res.send("Landfill Manager Page");
        }
        else {
            res.send("Unassigned User");
        }
    } catch (error) {
        res.status(500).send('Login failed');
    }
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