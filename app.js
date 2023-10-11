const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const flash = require('connect-flash');  
const routes = require("./routes/routes");
const session = require('express-session');
require('dotenv').config();
const passport = require('passport');
const app = express();
require('./controller/passport')(passport);
app.set('view engine', 'ejs');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
);

/* Passport middleware */
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.error_cntct = req.flash('error_cntct');
  next();
});

app.use(routes);

const PORT = process.env.PORT || 3000;

const DATABASE_URL = process.env.CONNECTION_URL;

app.listen(PORT, ()=>{
  console.log("Server started");
  mongoose 
    .connect(DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology: true})
    .then("Connected Successfully")
    .catch((err)=> console.log(err))
});


//! for deployment

// mongoose.connect(process.env.DB_LINK,{
//   useNewUrlParser: true,   
//   useUnifiedTopology: true
// });


