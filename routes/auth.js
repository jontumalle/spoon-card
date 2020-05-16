const User = require('../model/User');
const router = require('express').Router();

// Register
router
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', (req,res) => {
        const {firstName, lastName, email, password, passwordConfirm} = req.body;
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
        console.log(newUser);
        res.end();
    });

// Login
router
    .get('/login', (req,res) => { 
        res.render('login'); 
    })
    .post('/login', (req,res) => {
        console.log(req.body);
        res.end();
    });

module.exports = router;