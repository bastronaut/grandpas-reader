var router = require('express').Router();
var downloader = require('../services/nosfeeddownloader');
var xmlparser = require('../services/xmlparser');
var translater = require('../services/textToSpeechService');
var cors = require('cors');

router.use('/podcasts', (req, res, next) => {
    downloader.downloadMetOogOpMorgen().then(response => {
        console.log("Parsing oog op morgen xml...");
        xmlparser.parseString(response.data)
            .then((result, error) => { res.send(result.rss.channel[0]); })
            .catch(err => console.log(err));
    });
});

router.use('/synthesize', (req, res, next) => {

    const synthesizeText = req.body.text;
    const result = translater.translate(synthesizeText);

    result.then((audiocontent) => {
        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');
        res.write(audiocontent);

        res.end();
    })
})

router.use('/news', (req, res, next) => {

    downloader.downloadNOSNews().then(feeds => {
        console.log("result...");
        var promiseFeeds = feeds.map(f => {
            return xmlparser.parseString(f.data);
        });

        Promise.all(promiseFeeds).then(parsedFeeds => {
            merged = mergeFeeds(parsedFeeds);
            res.send({ "result": merged.flat() });
        });
    });
})

router.use('/listvoices', (req, res, next) => {
    translater.listVoices().then(voices => res.send(voices))
})

const mergeFeeds = (feeds) => {

    return feeds.map(feed => {
        console.log(feed);
        return feed.rss.channel[0].item;
    });
}

module.exports = router;


