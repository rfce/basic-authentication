// Checks if user is already logged in
const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token

    if (token !== undefined) {
        return res.redirect(307, "/dashboard")
    }
    next()
}

const isNotLoggedIn = (req, res, next) => {
    const token = req.cookies.token

    if (token === undefined) {
        return res.json({
            status: "fail",
            reason: "No token found. Please login to visit dashboard"
        })
    }

    req.token = token
    
    next()
}

module.exports = { isLoggedIn, isNotLoggedIn }
