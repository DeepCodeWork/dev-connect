const { check }  = require('express-validator')

const addUserErrorHandler = [
    check('name', 'Name is required')
        .not()
        .notEmpty(),
    
    check('email', 'Please include a valid email')
        .isEmail(),

    check('password','Enter a valid password with 6 or more characters')
        .isLength({min:6})
]

module.exports = addUserErrorHandler;