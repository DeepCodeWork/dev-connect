const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const addPostErrorhandler = require('../../ErrorHandler/post/addPostErrorHandler');
const Post = require('../../models/Post');
const User = require('../../models/User');


//@route  POST api/post/
//@desc   adding a comment
//@access protected
router.post('/', addPostErrorhandler,auth ,async (req,res)=>{

    //Checking the profile params
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const userPosting = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: userPosting.name,
            avatar: userPosting.avatar,
            user: req.user.id
        })

        await newPost.save();

        res.status(201).json(newPost);

    } catch (error) {
        
    }



})

module.exports  = router;