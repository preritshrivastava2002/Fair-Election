const mongoose = require('mongoose');

const sch = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type: String,
        required: true
    },
    image:{
        data : Buffer,
        contentType : String
    },
    upVote: { type: [String], default: []},
    downVote: { type: [String], default: []}
})

const Blog = new mongoose.model("Blog", sch);

module.exports = Blog;