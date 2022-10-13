const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
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
