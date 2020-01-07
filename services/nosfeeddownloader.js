const axios = require('axios');
const constants = require('../utils/constants')

// cache
const feeds = {};

const a = {
    "news": {
        "timestamp": "asd"
    }
};

const downloadFeed = (feedUrl) => {
    return axios.get(feedUrl);
}

// returns xml string 
const downloadMetOogOpMorgen = (feedUrl) => {
    return downloadFeed(constants.NOS_OOG_OP_MORGEN_PODCAST);
}

// NOS has multiple feeds... get 5 feeds and group them?
const downloadNOSNews = () => {

    if (shouldRefreshFeed(constants.NOS_NEWS_CACHE)) {

        console.log("Should refresh the feed");
        const algemeen = downloadFeed(constants.NOS_ALGEMEEN);
        const politiek = downloadFeed(constants.NOS_POLITIEK);

        return Promise.all([algemeen, politiek]).then(function (values) {
            setFeedCacheForFeed(constants.NOS_NEWS_CACHE, values);
            return values;
        })
    } else {
        // Refresh not required, return from cache
        console.log("No need to refresh feed");
        return new Promise((resolve, reject) => {
            resolve(feeds[constants.NOS_NEWS_CACHE].feedData);
        });
    }
}

const shouldRefreshFeed = (feed) => {
    // Feed not yet in cache, go fetch
    if (!feeds[feed]) {
        console.log("feeds not yet in cache, fetching: " + feed);
        return true;
    }

    const lastRefreshed = feeds[feed].timestamp;
    const now = new Date().getTime();
    return (now > lastRefreshed + constants.CACHE_REFRESH_DELTA);
}

const setFeedCacheForFeed = (feed, feedData) => {
    console.log("setting feed for");
    console.log(feed);
    feeds[feed] = {};
    feeds[feed].timestamp = new Date().getTime();
    feeds[feed].data = feedData;
}

exports.downloadFeed = downloadFeed;
exports.downloadMetOogOpMorgen = downloadMetOogOpMorgen;
exports.downloadNOSNews = downloadNOSNews;