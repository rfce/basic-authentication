const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "User"
    }
})

module.exports = mongoose.model("User", userSchema)
