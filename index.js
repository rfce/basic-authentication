const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cookies = require('cookie-parser')
const app = express()

dotenv.config()

const authRoute = require('./routes/api/auth')
const dashboardRoute = require('./routes/dashboard')

const {logger} = require('./middleware/logger.js')
const { isLoggedIn } = require('./middleware/loginStatus')

PORT = process.env.PORT || 3000

app.use(cookies())

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(logger)

const whitelist = ['http://localhost:3000', 'undefined', 'https://basic-authentication.herokuapp.com']

app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.some(item => String(origin) == item)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}))

app.get('(^/$)|(/register)', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'))
})

app.get('/login', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

app.use('/api', authRoute)
app.use('/dashboard', dashboardRoute)

app.all('*', (req, res) => {
    res.status(404).send('Page not found')
})

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => { console.log('Successfully connected to mongodb') })
    .catch(error => { console.log(error)})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})

