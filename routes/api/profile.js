const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile');
const { validationResult }  = require('express-validator');
const addProfileErrorhandler = require('../../ErrorHandler/profile/addProfileErrorHandler');
const User = require('../../models/User');
const request = require('request');
const config = require('config');
const axios = require('axios');

//@router  api/profile/me
//@desc   get current user profile
//@access private
router.get('/', auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id})
            .populate('user',['name','avatar']);

        if(!profile)
            return res.status(400).json({msg:'No profile for this user'});
        
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})


//@router api/profile/
//@desc   add current user profile
//@access private
router.post('/', auth, addProfileErrorhandler, async ( req,res )=>{
        
        //Checking the profile params
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(400).json({errors: errors.array()})
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company                   =   company;
        if(website) profileFields.website                   =   website;
        if(location) profileFields.location                 =   location;
        if(bio) profileFields.bio                           =   bio;
        if(status) profileFields.status                     =   status;
        if(githubusername) profileFields.githubusername     =   githubusername;      
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        // Build social project
        profileFields.social = {}
        if (youtube) profileFields.social.youtube       =   youtube;
        if (instagram) profileFields.social.instagram   =   instagram;
        if (linkedin) profileFields.social.linkedin     =   linkedin;
        if (facebook) profileFields.social.facebook     =   facebook;
        if (twitter) profileFields.social.twitter       =   twitter;

        
        try {
            //update if exist
            let profile = await Profile.findOne({user: req.user.id})
            if(profile){
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set : profileFields },
                    { new:true }
                )
                return res.json(profile);
            }

            

            //create new
            profile = new Profile(profileFields);
            await profile.save()

            return res.json(profile);

        } catch (error) {
            console.log(error)
            res.status(500).send('Server Error');
        }

})


//@router api/profile/all
//@desc   get all Profiles
//@access public
router.get('/all', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name', 'avatar']);
        res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }
})


//@router api/profile/user/:user_id
//@desc   get Profile by user ID
//@access public
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name', 'avatar']);

        if(!profile)
            return res.status(404).json({msg:"No profile found for this user"})

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        if(error.kind == 'ObjectId')
            return res.status(404).json({msg:"No profile found for this user"})
        res.status(500).send('Server Error')
    }
})

//@router DELETE api/profile
//@desc   delete user, profile, post
//@access private
router.delete('/', auth, async ( req, res )=>{
    try {
        // @todo delete posts by the user

        //Deleting the user profile
        await Profile.findOneAndRemove({user: req.user.id})

        //Deleting the user
        await User.findByIdAndRemove({_id:req.user.id});

        res.status(202).json({msg:'user is deleted'})
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

//@router PUT api/profile/experience
//@desc   add user experience
//@access private
router.put('/experience', auth, async (req,res)=>{
    
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user:req.user.id})
        //console.log(profile.company)
        profile.experience.unshift(newExperience);
        await profile.save();

        res.status(201).json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})


//@router DELETE api/profile/experience/:experience_id
//@desc   delete user experience
//@access private
router.delete('/experience/:experience_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        const indexOfExperience = profile.experience.map(exp=>exp._id).indexOf(req.params.experience_id);

        //Checking exp id
        if(indexOfExperience) return res.status(404).json({msg:'Experience Id not found'})
        profile.experience.splice(indexOfExperience,1);

        await profile.save()

        res.status(202).json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

//@router PUT api/profile/education
//@desc   add user education
//@access private
router.put('/education', auth, async (req,res)=>{
    
    const {
        school,
        degree,
        fieldOfstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldOfstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user:req.user.id})
        //console.log(profile.company)
        profile.education.unshift(newEducation);
        await profile.save();

        res.status(201).json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})


//@router DELETE api/profile/education/:education_id
//@desc   delete user education
//@access private
router.delete('/education/:education_id', auth, async (req,res)=>{
    try {
        console.log("check")
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.education.map(exp=>exp._id).indexOf(req.params.education_id);
        console.log(removeIndex)
        //Checking exp id
        if(removeIndex) return res.status(404).json({msg:'Education Id not found'})
        profile.education.splice(removeIndex,1);

        await profile.save()

        res.status(202).json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

//@router GET api/profile/github/:githubUsername
//@desc   get github profile
//@access public
router.get('/github/:githubUsername', (req,res)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.githubUsername}
                /repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
                &client_secret=${config.get('githubSecretKey')}`,
            method: 'GET',
            headers: { 'user-agent':'node.js' }
        };

        request(options, (err, response, body)=>{

            if(err) console.error(err)

            if(response.statusCode!==200) return res.status(404).json({msg : 'Github user not found'})

            res.status(200).json(JSON.parse(body));

        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
})



module.exports  = router;