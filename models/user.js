const mongoose = require('mongoose');

const sch = new mongoose.Schema({
    name: { type: String, uppercase: true },
    email: { type: String },
    phone: { type: Number },
    gender: { type: String, uppercase: true },
    age: { type: Number },
    password: { type: String },
    posts : [{
        title:{
            type:String,
        },
        body:{
            type: String,
        },
        image:{
            data : Buffer,
            contentType : String
        }
    }]
});

const User = new mongoose.model("User", sch);

module.exports = User;