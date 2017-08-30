var jwt = require('jsonwebtoken')
var secret
var modeldb
class AuthJWT {
    constructor(model) {
        modeldb = model
    }
    createToken(obj, secretKey) {
        var token = jwt.sign(obj, secretKey, { expiresIn: '7d' })
        return token
    }
    authRoute(req, res, next) {
        try {
            var de = jwt.decode(req.query.accessToken)

            if (de) {
                modeldb.findOne({ uid: de.uid }).lean().exec().then(data => {

                    var decoded = jwt.verify(req.query.accessToken, data.secret)

                    req.user = decoded
                    return next()
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json({ name: 'tokenInvalid' })
            }
        } catch (err) {
            res.json(err)
        }
    }

}
module.exports = AuthJWT