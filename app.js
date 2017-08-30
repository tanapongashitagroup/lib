'use strict'

var MyServer = require('./lib/myServer/myServer')
var sv = new MyServer(2000)
sv.initApp()
sv.getApp().get('/', (req, res) => {
    res.json('working');

})