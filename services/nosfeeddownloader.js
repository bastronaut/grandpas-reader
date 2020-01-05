const axios = require('axios');
const constants = require('../utils/constants')

const downloadFeed = (feedUrl) => {
    return axios.get(feedUrl);
}

// returns xml string 
const downloadMetOogOpMorgen = (feedUrl) => {
    return downloadFeed(constants.NOS_OOG_OP_MORGEN_PODCAST);
}

// NOS has multiple feeds... get 5 feeds and group them?
const downloadNOSNews = () => {
    const algemeen = downloadFeed("http://feeds.nos.nl/nosnieuwsalgemeen");
    const politiek = downloadFeed("http://feeds.nos.nl/nosnieuwspolitiek");

    return Promise.all([algemeen, politiek]).then(function (values) {
        console.log(values.length);
        return values;
        // return new Promise((resolve, reject) => {
        // resolve(values);
        // });
    })
}


exports.downloadFeed = downloadFeed;
exports.downloadMetOogOpMorgen = downloadMetOogOpMorgen;
exports.downloadNOSNews = downloadNOSNews;