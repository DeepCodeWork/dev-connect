const express = require('express');
const router  = express.Router();


//@route  api/post
//@desc   test link
//@access protected
router.get('/', (req,res)=>{res.send("post ready")})

module.exports  = router;