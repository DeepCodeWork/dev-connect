const { check }  = require('express-validator')

module.exports =  addCommentErrorHandler = [
    check('text','text is required')
        .not().isEmpty()
]