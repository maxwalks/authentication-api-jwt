const express = require('express')
const router = express.Router();
const User = require('../models/user')
const { requireAuth } = require('../../middleware/authMiddleware')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

router.get('/', (req, res) => {
    res.status(200).json({ Succes: "GET request successful" })
})

router.get('/protectedroute', requireAuth, async (req, res) => {
    try {
        res.status(200).json({ Success: "You have entered a protected route." })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/logout', requireAuth, async (req, res, next) => {
    res.cookie('jwt', '', {maxAge: 1 })
    res.status(200).json({ Success: "You have been logged out. " })
})

router.post('/login', async  (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.login(username, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly : true, maxAge: maxAge * 1000 });
        res.status(200).json({ Succes: "You have successfully logged in." })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/login', (req, res) => {
    res.status(200).json({ error: "Please create an account to continue" })
})

router.post('/register', async (req, res, next)=> {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        })
        const user = await User.create(newUser)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({ Success: "User successfully created." })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router;