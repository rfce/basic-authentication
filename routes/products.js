const express = require('express')
const router = express.Router()

const path = require('path')

router.get('/store', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'store.html'))
})

router.get('/purchase', (req, res) => {
    res.send('This is products purchase page')
})

module.exports = router
