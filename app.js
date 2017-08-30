'use strict'

var MyServer = require('./myServer/myServer')
var Mongodb = require('./mongodb/Mongodb')
var AuthJWT = require('./auth-jwt/AuthJWT')
var db = new Mongodb('mongodb://a1:qwer1234@ds113841.mlab.com:13841/ecs')
var Socket = require('./socket/Socket')
var Mail = require('./mail/Mail');

db.setSchema({}, 'users')
db.setSchema({
    uid: String,
    secret: String
}, 'session')

var sv = new MyServer(2000)

var socket = new Socket(sv.getServer())
sv.initApp()

var auth = new AuthJWT(db.getDb('session'))
sv.getApp().get('/mail', (req, res) => {
    var mail = new Mail('key-2b4093f93be9a81f4910ca7c4649fe75');
    mail.sendText('test', 'สวัดัส', ['jakkapong@ashitagroup.com']);
    res.json({ 'message': 'success' });
});
sv.getApp().get('/user', auth.authRoute, (req, res) => {
    res.json('success')
})
sv.getApp().get('/logout', (req, res) => {
    var date = new Date()
    db.getDb('session').update({ uid: 'tanapong' }, { secret: date.getTime() }).exec()
    res.end()
})
sv.getApp().get('/login', (req, res) => {
    db.getDb('session').findOne({ uid: 'tanapong' }).lean().exec().then(data => {

            var token = auth.createToken(data, data.secret)
            res.json(token)
        }).catch(err => {
            res.json(err)
        })
        // auth.createToken()
        // var date = new Date()
        // var add = db.getDb('session')
        // new add({ uid: 'tanapong', secret: date.getTime() }).save(err => {
        //     if (err) {
        //         res.json(err)
        //     } else {
        //         res.json('insert success')
        //     }
        // })
})
sv.getApp().get('/api', (req, res) => {
    res.json('working');
    // res.json({ accessToken: auth.createToken({ name: 'tanapong' }) })
})
sv.getApp().get('/user', auth.authRoute, (req, res) => {
    res.json('success')
        // res.json({ accessToken: auth.createToken({ name: 'tanapong' }) })
})