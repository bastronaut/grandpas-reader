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

router.use('/translate', (req, res, next) => {

    const result = translater.translate("In de buurt van het Russische Vladivostok zijn zo'n 25 auto's door het ijs gezakt nadat de bestuurders een bevroren meer als parkeerplaats hadden gebruikt. De chauffeurs waren in de buurt gaan ijsvissen. Na een uur kregen ze berichten dat hun auto's aan het zinken waren.")

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


const mergeFeeds = (feeds) => {

    return feeds.map(feed => {
        console.log(feed);
        return feed.rss.channel[0].item;
    });
}

module.exports = router;


