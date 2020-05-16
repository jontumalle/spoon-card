const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

// MongoDB User Document
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 1
    },
    lastName: {
        type: String,
        required: true,
        min: 1
    },
    email: {
        type: String,
        required: true,
        max: 256,
        min: 1
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Joi schemas for validation
const registerSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(256),
    lastName: Joi.string()
        .min(1)
        .max(256),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
        .messages({
            'string.pattern.base': "Invalid Password"
        }),
    passwordConfirm: Joi.any()
        .equal(Joi.ref('password'))
        .messages({
            'any.only': "Passwords must match"
        })
        
}).with('password', 'passwordConfirm')
    .with('firstName','lastName');

const loginSchema = Joi.object({
    email: Joi.string()
        .email(),
    password: Joi.string()
}).with('email', 'password');

// -----Middleware-----
// Registration
registerValidation = async (req, res, next) => {

    // Validate request structure
    const {error} = registerSchema.validate(req.body);
    if(error) {
        error.details.forEach((detail) => console.log(detail.message));
        return res.status(400).redirect('/users/register');
    }

    // Ensure email is unique
    const User = mongoose.model('User', userSchema);
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) {
        return res.status(400).send("Email already exists")
    }

    next();
};

loginValidation = async (req, res, next) => {
    const {error} = await loginSchema.validateAsync(req.body);
    if(error) {
        error.details.forEach((detail) => console.log(detail.message));
        return res.status(400).redirect('/users/login');
    }

    next();
};


module.exports = {
    User: mongoose.model('User', userSchema),
    checkValidNewUser: registerValidation,
    checkValidUser: loginValidation
};

