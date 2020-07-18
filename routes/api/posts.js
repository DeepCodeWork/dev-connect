const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const addPostErrorhandler = require('../../ErrorHandler/post/addPostErrorHandler');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { validationResult } = require('express-validator');
const e = require('express');
const addCommentErrorHandler = require('../../ErrorHandler/post/addCommentErrorHandler');


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
        console.error(error);
        res.status(500).send('Server Error');
    }



})


//@route  GET api/posts/
//@desc   fetching all the post
//@access private
router.get('/', auth, async (req,res)=>{

    try {
        const posts = [] = await Post.find().sort({ date: -1 });

        if(!posts) return res.status(404).json({msg:'No posts found'})

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }


})


//@route  GET api/posts/:id
//@desc   Get post by user id
//@access private
router.get('/:userId', auth, async (req,res)=>{

    try {
        const posts = [] = await Post.find({user:req.params.userId}).sort({ date: -1 });

        if(posts.length===0) return res.status(404).json({msg:'No post for this user found'})

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 
        res.status(500).send('Server Error');
    }

})



//@route  DELETE api/posts/:id
//@desc   Delete post by user id
//@access private
router.delete('/:postId', auth, async (req,res)=>{

    try {
        const post  = await Post.findById(req.params.postId)

        if(!post) return res.status(404).json({msg:'No post for this user found'})

        if(post.user.toString()!==req.user.id) return res.status(401).json({msg:'User not authorized'})

        await post.remove();

        res.status(200).json("Post deleted");
    } catch (error) {
        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 
        res.status(500).send('Server Error');
    }

})



//@route  POST api/posts/like/:postId
//@desc   Adding a like to the post
//@access private
router.post('/like/:postId', auth, async (req,res)=>{

    try {
        const post  = await Post.findById(req.params.postId)

        if(!post) return res.status(404).json({msg:'No post for this user found'})

        //Checking if the post have already been liked
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length>0)
            return res.status(400).json({msg:'post has already been liked'});
        

        post.likes.unshift({ user:req.user.id });

        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 
        res.status(500).send('Server Error');
    }

})


//@route  POST api/posts/unlike/:postId
//@desc   unlike a post
//@access private
router.post('/unlike/:postId', auth, async (req,res)=>{

    try {
        const post  = await Post.findById(req.params.postId)

        if(!post) return res.status(404).json({msg:'Invalid post id'})

        //Checking if the post have already been liked
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length==0)
            return res.status(400).json({msg:'post has not been liked'});
        

        if(post.user.toString()!==req.user.id) return res.status(401).json({msg:'User not authorized'})

        const removeindex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeindex,1);

        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 
        res.status(500).send('Server Error');
    }

})

//@route  POST api/posts/comment/:postId
//@desc   unlike a post
//@access private
router.post('/comment/:postId', addCommentErrorHandler, auth, async (req,res)=>{

    //Checking the profile params
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const currentUser = await User.findById(req.user.id).select('-password');

        const post  = await Post.findById(req.params.postId);

        const comment = {
            user:req.user.id,
            text:req.body.text,
            name:currentUser.name,
            avatar:currentUser.avatar
        }

        post.comments.unshift(comment);

        await post.save();

        res.status(201).json(post);

    } catch (error) {

        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 

        res.status(500).send('Server Error');
    }

})



//@route  DELETE api/posts/comment/:id
//@desc   Delete comment by comment id
//@access private
router.delete('/comment/:postId/:commentId', auth, async (req,res)=>{

    try {
        const post  = await Post.findById(req.params.postId)

        const comment = post.comments.find(
            comment=>comment.id === req.params.commentId
        )

        //Checking if comment exist
        if(!comment) return res.status(401).json({msg:'Invalid comment id'});

        //Checking the user
        if(comment.user.toString() !== req.user.id ) return res.status(401).json({msg:'User not authorized'});

        const removeCommentIndex = post.comments.map( comment => comment.user.toString()).indexOf(req.user.id);
        
        post.comments.splice(removeCommentIndex, 1);

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        if(error.kind=='ObjectId')
            return res.status(500).send('invalid user id'); 
        res.status(500).send('Server Error');
    }

})


module.exports  = router;