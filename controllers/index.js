var router = require('express').Router();
var downloader = require('../services/nosfeeddownloader');
var xmlparser = require('../services/xmlparser');
var translater = require('../services/textToSpeechService');
var cors = require('cors');
var striptags = require('striptags');

router.use('/podcasts', (req, res, next) => {
    downloader.downloadMetOogOpMorgen().then(response => {
        console.log("Parsing oog op morgen xml...");
        xmlparser.parseString(response.data)
            .then((result, error) => { res.send(result.rss.channel[0]); })
            .catch(err => console.log(err));
    });
});

router.use('/synthesize', (req, res, next) => {

    const feed = req.query.feed;
    const itemNr = req.query.nr;
    const titleOnly = req.query.titleOnly
    const dateOnly = req.query.dateOnly;

    console.log("requesting item: " + itemNr);

    // Item doesnt exist, maybe add some better error handling
    const itemToSynthesize = downloader.getFeedAtIndex(feed, itemNr);
    if (!itemToSynthesize) {
        console.log("Item " + itemNr + " does not exist in cache");
        res.send({ error: "Item at index does not exist" });
        return;
    }

    let textToSynthesize;

    if (titleOnly) {
        const htmltextToSynthesize = itemToSynthesize.title[0];
        textToSynthesize = striptags(htmltextToSynthesize);

    } else if (dateOnly) {
        const htmltextToSynthesize = itemToSynthesize.pubDate[0];
        textToSynthesize = formatDate(new Date(htmltextToSynthesize));

    } else {
        // const title = striptags(itemToSynthesize.title[0]);
        // const description = striptags(itemToSynthesize.description[0]);

        // textToSynthesize = '<speak>' + title + '<break time="3s"/>' + description + '</speak>';

        const title = striptags(itemToSynthesize.title[0]);
        let description = itemToSynthesize.description[0];

        // Dirty hack to remove all tags, but have a custom tag inserted again in correct position
        description = description.replace("</p>", "INSERTBREAK");
        description = striptags(description);
        description = description.replace("INSERTBREAK", '<break time="0.5s"/>');

        textToSynthesize = '<speak>' + title + '<break time="1s"/>' + description + '</speak>';

    }

    console.log("going to synthesize...: ");
    console.log(textToSynthesize);

    const result = translater.translate(textToSynthesize);

    result.then((audiocontent) => {
        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');
        res.write(audiocontent);

        res.end();
    }).catch( (error) => {
        console.log(error);
    })
})


router.use('/news', (req, res, next) => {

    downloader.downloadNOSNews().then(feeds => {

        res.send({ "result": feeds });

    });
})

router.use('/listvoices', (req, res, next) => {
    translater.listVoices().then(voices => res.send(voices))
})


formatDate = (date) => {
    let monthNames = [
        "Januari", "Februari", "Maart",
        "April", "Mei", "Juni", "Juli",
        "Augustus", "September", "Oktober",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();

    return day + ' ' + monthNames[monthIndex] + ' om ' + hour + ' uur ' + min;
}



module.exports = router;



