const jwt = require('jsonwebtoken')
const User = require('../server/models/user')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, "secret", (error, decodedToken) => {
            if(error) {
                next(error)
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, "secret", async (error, decodedToken) => {
            if(error) {
                res.locals.user = null
                next();
            } else {
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};