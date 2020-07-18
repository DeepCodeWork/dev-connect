const express = require('express');
const router  = express.Router();
const auth  = require('./../../middleware/auth')
const User  = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { validationResult }  = require('express-validator')
const loginUserErrorHandler = require('../../ErrorHandler/User/loginUserErrorHandler');


//@route  api/auth
//@desc   auth link
//@access protected
router.get('/',auth, async (req,res)=>{
    try {
        const userLoggedIn = await User.findById(req.user.id).select('-password');
        res.status(200).json(userLoggedIn);
    } catch (error) {
        res.status(500).send('Server Error')
    }
})


//@router   api/users
//@desc     login a user
//@access   public
router.post('/login', loginUserErrorHandler, async (req,res)=>{
    try {

        //Checking the user params
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const { email, password } = req.body
        
        //Check if the user exist
        let userExist =  await User.findOne({email})
        if(!userExist)
            return res.status(401).json({errors: [{ msg:"Email do not exist. Please login" }]})

        //Checking the password
        const isMatch = await bcrypt.compare(password, userExist.password)
        if(!isMatch)
            return res.status(401).json({errors: [{ msg:"Email and password do not match" }]})

        const payload = {
            user:{
                id:userExist.id
            }
        }

        jwt.sign(payload, config.get('jwtSecretKey'), 
            { expiresIn:63000 }, (error, token)=>{
                if(error) throw error;
                res.json({token});
            })


        //res.status(200).send(user);
    }catch (error) {    
        console.error(error);
        res.status(500).send("server error");
    }
    
});


module.exports  = router;