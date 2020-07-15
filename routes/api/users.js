const express = require('express');
const router  = express.Router();
const {validationResult}  = require('express-validator');
const addUserErrorHandler = require('../../ErrorHandler/User/addUserErrorHandler');
const User =  require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');



//@router   api/users
//@desc     Register a user
//@access   public
router.post('/add', addUserErrorHandler,async (req,res)=>{
    try {

        //Checking the user params
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body
        
        //Check if the user already exist
        let userAlreadyExist =  await User.findOne({email})
        if(userAlreadyExist)
            return res.status(400).json({errors: [{ msg:"Email already exist" }]})

        //Adding avatar
        const avatar = gravatar.url(email, {
            size:'200',
            rating:'pg',
            default:'mm'
        })

        const user = new User({name, email, password, avatar})

        //encrypting password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        
        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecretKey'), 
            { expiresIn:63000 }, (error, token)=>{
                if(error) throw error;
                console.log(token)
                res.json({token});
            })


        //res.status(200).send(user);
    }catch (error) {    
        console.error(error);
        res.status(500).send("server error");
    }
    
});

module.exports  = router;