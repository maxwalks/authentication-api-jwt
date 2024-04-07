require('dotenv').config();
const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const connectDB = require('./server/config/db')
const errorHandler = require('./middleware/errorHandler')
const {checkUser} = require('./middleware/authMiddleware');

const PORT = 3000;

connectDB();
app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(cookieParser())

app.use('/', require('./server/routes/main'))
app.use(errorHandler)
app.use('*', checkUser)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})