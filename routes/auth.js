const {User, checkValidNewUser, checkValidUser} = require('../model/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

// Register
router
    .get('/register', (req, res) => {
        res.render('register');
    })
    .post('/register', checkValidNewUser, (req,res) => {
        const {firstName, lastName, email, password} = req.body;

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                // Error with creating bcrypt hash
                console.log(err);
                return res.status(400).redirect('/register');
            }

            // Create user document with hash and save in db
            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash
            });
            newUser.save();
            return res.status(200).send("Thanks for registering"+ firstName);
        });
    });

// Login
router
    .get('/login', (req,res) => { 
        res.render('login'); 
    })
    .post('/login', checkValidUser, async (req,res) => {
        const {email, password} = req.body;
        const loginUser = await User.findOne({email: email});
        if(!loginUser) {
            return res.status(400).send('Email does not exist');
        }

        const validPassword = await bcrypt.compare(password, loginUser.password);
        if(validPassword){
            return res.status(200).send("Welcome back "+loginUser.firstName);
        } else{
            return res.status(400).send("Password incorrect");
        }

    });




module.exports = router;