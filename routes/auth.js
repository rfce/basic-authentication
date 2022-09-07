const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
    res.send('This is login route')
})

router.get('/register', (req, res) => {
    res.send('This is register route')
})

module.exports = router
