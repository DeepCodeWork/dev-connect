const { check }  = require('express-validator')

module.exports =  addProfileErrorHandler = [
    check('skills','Skills is required')
        .not().isEmpty(),

    check('status', 'Status is required')
        .not().isEmpty()
]