const jwt = require("jsonwebtoken")
async function generateToken(userId) {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_JWT, {
        expiresIn: "7d"
    })
    return token
}
module.exports = generateToken