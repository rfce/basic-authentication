const path = require('path')
const fs = require('fs').promises
const fsync = require('fs')
const { v4: uuid } = require('uuid')

const logger = async (req, res, next) => {
    if (!fsync.existsSync(path.join(__dirname, '..', 'data'))) {
        await fs.mkdir(path.join(__dirname, '..', 'data'))
    }
    const log = `[+] ${req.method} ${req.path} ${req.url} ${uuid()} ${req.ip}\n`
    await fs.appendFile(path.join(__dirname, '..', 'data', 'logs.txt'), log)
    next()
}

module.exports = { logger }
