const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const path = require('path');

router.post('/', async (req, res) => {
    try {
        const { name, password, email, role } = req.body;
        const newUser = new User({
            name: name,
            password: password,
            email: email,
            role: role
        });
        const result = await newUser.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
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
