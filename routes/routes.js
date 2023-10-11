const express = require('express');
const router = express.Router();
const {findPost, post, deletePost, updatePage, updatePost, myPost, upVote, downVote} = require("../controller/controller");
const {formRegister, formLogin, logout} = require("../controller/user"); 
const Blog = require("../models/post");
const User = require("../models/user");
const upload = require("../middleware/upload");
const fs = require('fs');
const path = require('path');
router.use(express.urlencoded({extended: true}));
router.use(express.json());

//home page
router.get("/" , (req , res)=>{
    res.render("index", {user : req.user});
    // res.sendFile(path.resolve(__dirname +  "/../index.html"));
});

router.get("/home" , (req , res)=>{
    res.redirect("/");
});  
router.get("/latest", findPost);

// Register Page
router.get('/formregister', (req, res) => {
    res.render('formregister')
});

// Login Page
router.get('/formlogin', (req, res) => {
    res.render('formlogin');
});

// User Registration
router.post('/formregister', formRegister);

// User Login 
router.post('/formlogin', formLogin);

// User Logout 
router.get('/logout', logout);

//about page
router.get("/about", (req, res) => {
    res.render("about",{user: req.user});
});

//contact page
router.get("/contact", (req, res) => {
    res.render("contact");
});

//compose page
router.get("/report", (req, res) => {
    res.render("compose", {user: req.user});
});
router.post("/compose", upload.single('postImage'), async(req,res)=>{
    console.log(req.file);
    // console.log(req.body);
    // console.log(req.user);
    if(typeof req.file != 'undefined'){
        const blog = new Blog({
            title: req.body.postTitle,
            body: req.body.postBody,
                image:{
                    data: fs.readFileSync(path.join(process.cwd()+ "/uploads/" + req.file.filename)),
                    contentType: req.file.mimetype
                }
        });
        const result = await Blog.insertMany([blog]);
    }
    else{
        const blog = new Blog({
            title: req.body.postTitle,
            body: req.body.postBody
        });
        const result = await Blog.insertMany([blog]);
    }
    
    
    if(typeof req.file != 'undefined'){
        const userPost = await User.findOneAndUpdate({_id: req.user._id},{
            $addToSet:{'posts':[{
                    title: req.body.postTitle,
                    body: req.body.postBody,
                    image:{
                        data: fs.readFileSync(path.join(process.cwd()+ "/uploads/" + req.file.filename)),
                        contentType: req.file.mimetype
                    }
                }]
            }
        });
    }
    else{
        const userPost = await User.findOneAndUpdate({_id: req.user._id},{
            $addToSet:{'posts':[{
                    title: req.body.postTitle,
                    body: req.body.postBody
                }]
            }
        });
    }
    // console.log(userPost.posts.title);
    // console.log(result);
    res.redirect("/latest");
});

//shows individual post on clicking
router.get("/reports/:id", post);

router.get("/myReport/:id", myPost);

//delete post
router.post("/delete/:userid/:id", deletePost);
router.post("/delete/:id", deletePost);

//update post
router.get("/update/:id", updatePage);
router.post("/update/:id", updatePost);

router.post("/upVote/:id", upVote);
router.post("/downVote/:id", downVote);

module.exports = router;