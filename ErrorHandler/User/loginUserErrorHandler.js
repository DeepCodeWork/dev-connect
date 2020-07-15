const { check }  = require('express-validator')

const loginUserErrorHandler = [
    check('email', 'Please include a valid email')
        .isEmail(),

    check('password','Please enter the password')
        .exists()
]

module.exports = loginUserErrorHandler;