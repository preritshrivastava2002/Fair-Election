const Blog = require("../models/post");
const User = require("../models/user");

exports.findPost = async(req,res)=>{
    const result = await Blog.find({});
    res.render("home",{
        home: "Home",
        journal: result, 
        user: req.user
    });
}

// exports.newPost = async(req,res)=>{
//     const blog = new Blog({
//         title: req.body.postTitle,
//         body: req.body.postBody,
//     });
//     const result = await Blog.insertMany([blog]);
//     console.log(result);
//     res.redirect("/");
// }

exports.deletePost = async(req,res)=>{
    try{
        const requesteduserid = req.params.userid;
        const requestedid = req.params.id;
        const see = await Blog.findById(requestedid);
        if(see == null){
            try{
                await User.updateOne(
                    { requesteduserid }, 
                    { $pull: { 'posts': { requestedid} } }
                )
                console.log("Deleted successfully");
            }
            catch(error){
                console.log(err);
            }
        }
        else {const result = await Blog.deleteOne({_id: requestedid});}
        res.redirect("/latest");
    }
    catch(err){
        console.log(err);
    }
}

exports.updatePage = async(req,res)=>{
    const requestedid = req.params.id;
    // const result = Blog.findOneAndUpdate({id: req.params.id});
    // res.render("update", {thisPost: result});
    Blog.findById(requestedid, (err,result)=>{
        // console.log(result);
        res.render('update' , {thisPost : result, user : req.user});
    })
}

exports.updatePost = async(req,res)=>{
    const requestedid = req.params.id;

    const updatedTitle = req.body.title;
    const updatedBody = req.body.content;

    const result = await Blog.findOneAndUpdate({requestedid},{
        $set:{
            title: updatedTitle,
            body: updatedBody
        }
    });

    res.redirect("/latest");
}

exports.post = async (req, res) => {
    // const requesteduserid = req.params.userid;
    const requestedid = req.params.id;

    const result = await Blog.findById(requestedid);
    // if(result=null) {
    //     const result1 = await User.findById(requesteduserid);  
    //     res.render("allPost",{thisPost : result1, user : req.user});
    // }
    // else{
        res.render("post",{thisPost : result, user : req.user});
    // }
}

exports.myPost = async(req,res)=>{
    const userid = req.params.id;
    const result = await User.findById(userid);
    res.render("myPost",{userPost : result.posts, id : userid,  user : req.user});
}

exports.upVote = async(req,res)=>{
    const requestedid = req.params.id;
    const userId = req.user;
    if(typeof userId != 'undefined'){
        try {
            const post = await Blog.findById(requestedid);
            const upIndex = post.upVote.findIndex((requestedid) => requestedid === String(userId._id));
            const downIndex = post.downVote.findIndex((requestedid) => requestedid === String(userId._id));
            console.log(upIndex);
    
            if (downIndex !== -1) {
                const userPost = await Blog.findOneAndUpdate({_id: requestedid},{
                    $pull:{
                        downVote: String(userId._id)
                    }
                }
                );
            }
            if (upIndex === -1) {
                const userPost = await Blog.findOneAndUpdate({_id: requestedid},{
                    $push:{
                        upVote: String(userId._id)
                    }
                }
                );
                const post1 = await Blog.findById(requestedid);
                console.log(post1);
            } else {
                post.upVote = post.upVote.filter((requestedid) => requestedid !== String(userId._id));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    res.redirect("/latest");
},

exports.downVote = async(req,res)=>{
    const requestedid = req.params.id;
    const userId = req.user;
    // console.log(userId);
    if(typeof userId != 'undefined'){
        try {
            const post = await Blog.findById(requestedid);
            const upIndex = post.upVote.findIndex((requestedid) => requestedid === String(userId._id));
            const downIndex = post.downVote.findIndex((requestedid) => requestedid === String(userId._id));
            console.log(upIndex);
            if (upIndex !== -1) {
                const userPost = await Blog.findOneAndUpdate({_id: requestedid},{
                    $pull:{
                        upVote: String(userId._id)
                    }
                }
                );
            }
            if (downIndex === -1) {
                const userPost = await Blog.findOneAndUpdate({_id: requestedid},{
                    $push:{
                        downVote: String(userId._id)
                    }
                }
                );
                // const post1 = await Blog.findById(requestedid);
                // console.log(post1);
            } else {
                post.downVote = post.downVote.filter(
                    (requestedid) => requestedid !== String(userId._id)
                );
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    res.redirect("/latest");
}