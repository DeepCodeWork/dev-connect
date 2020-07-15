const express = require('express');
const router  = express.Router();


//@router  api/profile
//@desc   test link
//@access protected
router.get('/', (req,res)=>{res.send("profile ready")})

module.exports  = router;