const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../model/User')
const { isLoggedIn, isNotLoggedIn } = require('../../middleware/loginStatus')

router.post('/login', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (user === null) {
        return res.json({
            status: "fail",
            reason: "Email address not registered"
        })
    }

    const hashedPassword = user.password

    const match = await bcrypt.compare(req.body.password, hashedPassword)

    if (match === false) {
        return res.json({
            status: "fail",
            reason: "Incorrect password"
        })
    }

    const token = jwt.sign(
        {
            email: user.email,
            role: user.role
        },
        process.env.JWT_ACCESS_TOKEN
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true
    })

    res.json({
        status: "success",
        reason: "User login successful",
    })
})

router.post('/register', isLoggedIn, async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if (email && password) {
        // Check if email is valid
        const validEmail = email.match(/[-\.+()<>_a-z0-9]+@[-a-z0-9]+\.[a-z]{1,3}(\.[a-z]{1,3})?/ig)
        
        if (validEmail === null || validEmail[0] !== email) {
            return res.json({
                status: "fail",
                reason: "Invalid email address"
            })
        }

        //  Password should have atleast eight characters
        if (password.length < 8) {
            return res.json({
                status: "fail",
                reason: "Password should have atleast eight characters"
            })
        }

        // Password must include capital, small alphabets, numbers and a symbol
        const small = password.match(/[a-z]+/g)
        const capital = password.match(/[A-Z]+/g)
        const number = password.match(/[0-9]+/g)
        const symbol = password.match(/[-+~`@#$%^&*()_={}\[\]\/:;"'<>,?\.]+/g)
        
        if (small === null || capital === null || symbol === null || number === null) {
            return res.json({
                status: "fail",
                reason: "Password must include capital, small alphabets, numbers and a symbol"
            })
        }

        // Check if duplicate email
        const duplicate = await User.findOne({ email })

        if (duplicate !== null) {
            return res.json({
                status: "fail",
                reason: "Email address already registered"
            })
        }

        const hashed = await bcrypt.hash(password, 10)

        // Save new user to database
        const save = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashed
        })

        const token = jwt.sign(
            {
                email,
                role: "User"
            },
            process.env.JWT_ACCESS_TOKEN
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true
        })

        res.json({
            status: "success",
            reason: "User registered successfully",
        })

    } else {
        res.json({
            status: "fail",
            reason: "Username and password are required"
        })
    }
})

router.get('/info', isNotLoggedIn, async (req, res) => {
    let email
    const token = req.token

    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (error, decoded) => {
            if (error) {
                return res.json({
                    status: "fail",
                    reason: "jsonwebtoken is not valid"
                })
            }
            email = decoded.email
        }
    )

    const user = await User.findOne({ email })

    res.json({
        status: "success",
        data: {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role
        }
    })
})

router.get('/logout', isNotLoggedIn, (req, res) => {
    const token = req.token
    
    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (error, decoded) => {
            if (error) {
                return res.json({
                    status: "fail",
                    reason: "jsonwebtoken is not valid"
                })
            }
        }
    )

    res.clearCookie('token')
    
    res.json({
        status: "success",
        reason: "User logged out successfully"
    })
})

module.exports = router

