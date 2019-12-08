var router = require('express').Router();
var downloader = require('../services/nosfeeddownloader');
var xmlparser = require('../services/xmlparser');
var cors = require('cors');

router.use('/podcasts', (req, res, next) => {
    downloader.downloadMetOogOpMorgen().then(response => {
        console.log("Parsing oog op morgen xml...");
        xmlparser.parseString(response.data)
            .then((result, error) => { res.send(result.rss.channel[0]); })
            .catch(err => console.log(err));
    });
});

module.exports = router;