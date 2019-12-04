// example.js - Example front-end (client-side) code using browser-request via browserify
//
var request = require('browser-request')
request('http://feeds.nos.nl/nosnieuwsalgemeen', function (er, res) {
    if (!er)
        return console.log('browser-request got your root path:\n' + res.body)

    console.log('There was san error, but at least browser-request loaded and ran!')
    throw er
})
