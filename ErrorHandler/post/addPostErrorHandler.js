const { check }  = require('express-validator')

module.exports =  addPostErrorHandler = [
    check('text','text is required')
        .not().isEmpty()
]