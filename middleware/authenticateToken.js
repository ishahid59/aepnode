require('dotenv').config()
const jwt = require('jsonwebtoken');



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
     if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// to export authenticateToken in server to use globally or use in individual modules
// note: exporting this will cause authenticateToken activated for all routes in this module
// So middlewares should be kept in a seperate module
module.exports = authenticateToken;