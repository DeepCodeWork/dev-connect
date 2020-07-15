const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){

    const token = req.header('x-auth-token');

    //If token is null
    if(!token) res.status(401).send({msg:'No token, authorization denied'})

    try {

        const decoded = jwt.verify(token, config.get('jwtSecretKey'));

        console.log(decoded)
        req.user = decoded.user;
        next()

    } catch (error) {
        res.status(401).send({msg:'token is invalid'})
    }
}