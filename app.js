if( process.env.NODE_ENV !== 'production' ){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');

// Create express app with ejs view engine
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to DB
mongoose.connect( process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to DB!'))
    .catch(err => console.log(err));


// Main Middleware
app.use(express.urlencoded({ extended: false }));

// Import routes
const mainRoute = require('./routes/main');
const authRoute = require('./routes/auth');

// Route Middleware
app.use('/', mainRoute);
app.use('/users', authRoute);


// Starting Server
app.listen(3000, () => console.log('Listening on port 3000...') );