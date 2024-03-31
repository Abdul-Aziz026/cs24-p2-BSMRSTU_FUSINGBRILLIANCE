const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Parse JSON bodies for this application
const nodemailer = require('nodemailer');

// router.use((req, res, next)=>{
//     return res.send(req.body);
//     // next();
// });

// router.post('/', async (req, res) => {
//     try {
//         const { name, password, email, role } = req.body;
//         console.log(name,password,email,role);
//         const newUser = new User({
//             name: name,
//             password: password,
//             email: email,
//             role: role
//         });
//         const result = await newUser.save();
//         res.render('userList.ejs');
//     } catch (err) {
//         console.error('Error creating user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });
 
 
router.post('/', async (req, res) => {
    try {
        const { name, password, email, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            password: hashedPassword,
            email: email,
            role: role
        });
        console.log(newUser)
        const result = await newUser.save();
        // res.render('userList.ejs');
        console.log('yes');
        res.render('userList.ejs');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Registration failed');
    }
});
 
 
router.get('/',(req,res)=>{
    // res.send("come");
    // res.redirect("/home");
    res.render('userList.ejs');
})
router.get('/fetch', async (req, res) =>{
 
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/role/:role_id', async (req, res) => {
    try {
        const role_id = req.params.role_id;
        const users = await User.find({ role: role_id });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users by role:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/roles',(req,res)=>{
    console.log('yes');
     res.render('user_role.ejs',{});
});


router.get('/createUser', (req, res) => {
    res.render('create_user.ejs');
});

router.get("/:role_id/p", async(req, res)=>{
    const role_id = req.params.role_id;
    const user = await User.findById(role_id);
    res.render("userProfileUpd.ejs", {user});
});


router.post('/:id', async (req, res) => {
    // return res.send(req.body);
    // console.log('put method call');
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's information
        user.name = name || user.name;
        user.email = email || user.email;
         console.log('yes')
        // Save the updated user
        user = await user.save();
        req.session.user = user;
        return res.redirect('/profile') 
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.put('/:id/roles', async (req, res) => {
    console.log("coming,,,,");
    try {
        const id = req.params.id;
        const { role, sts_id } = req.body;
        console.log(role,sts_id)

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: role, sts_id: sts_id }, // Pass both fields in a single object
            { new: true } // Options object for returning the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// router.put('/:userId/p', (req, res) => {
//     const userId = req.params.userId; // Get the userId from URL parameter
//     const { name, email } = req.query; // Get name and email from query parameters
  
//     // Perform any necessary validation or processing here
//     // For now, let's just send back a response with the received data
//     res.json({ userId, name, email });
// });


router.get('/:role_id', async (req, res) => {
    try {
        const role_id = req.params.role_id;
        const user = await User.findOne({ _id: role_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // res.json(user);
        res.render('profile.ejs',{user});
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});
 
// router.put('/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { name, password, email, role } = req.body;
 
//         const updatedUser = await User.findByIdAndUpdate(id, {
//             name: name,
//             password: password,
//             email: email,
//             role: role
//         }, { new: true }); 
 
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
 
//         res.json(updatedUser);
//     } catch (err) {
//         console.error('Error updating user:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });
 

 
 
// Create a route handler for listing all available roles
router.get('/roles', async (req, res) => {
    return res.send('yes');
    // try {
 
    //   const roles = await User.find({}); // Fetch all roles
    //   res.json(roles);
    // } catch (err) {
    //   console.error('Error fetching roles:', err);
    //   res.status(500).send('Internal Server Error');
    // }
  });
 
 
router.put('/:id', async (req, res) => {
    // console.log(req.body);
    return res.send("helllo");
    try {
      const id = req.params.id;
      const { role } = req.body;
 
      const updatedUser = await User.findByIdAndUpdate(id, { role: role }, { new: true });
 
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