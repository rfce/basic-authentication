const path = require('path')
const cors = require('cors')
const express = require('express')
const app = express()

const authRoute = require('./routes/auth')
const productsRoute = require('./routes/products')

const {logger} = require('./middleware/logger.js')

PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(logger)

const whitelist = ['http://localhost:3000', 'www.google.com', 'undefined']

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.use('/auth', authRoute)

app.use('/products', productsRoute)

app.get('/middleware', (req, res, next) => {
    console.log("I'm a middleware...")
    next()
}, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.all('*', (req, res) => {
    res.status(404).send('Page not found')
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})

