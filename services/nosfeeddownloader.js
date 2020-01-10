const axios = require('axios');
const constants = require('../utils/constants')
var xmlparser = require('../services/xmlparser');

// cache
const feeds = {};


const downloadFeed = (feedUrl) => {
    return axios.get(feedUrl);
}

// returns xml string 
const downloadMetOogOpMorgen = (feedUrl) => {

    if (shouldRefreshFeed(constants.OOG_OP_MORGEN_CACHE)) {
        return downloadFeed(constants.NOS_OOG_OP_MORGEN_PODCAST).then((result) => {
            setFeedCacheForFeed(constants.OOG_OP_MORGEN_CACHE, result);
            return new Promise((resolve, reject) => {
                resolve(result);
            });
        });
    } else {
        for (key in feeds) {
            console.log(key);
        }

        return new Promise((resolve, reject) => {
            resolve(feeds[constants.OOG_OP_MORGEN_CACHE].feedData);
        });
    }
}

// NOS has multiple feeds... get x feeds and group them?
const downloadNOSNews = () => {

    if (shouldRefreshFeed(constants.NOS_NEWS_CACHE)) {

        console.log("Should refresh the feed");
        const algemeen = downloadFeed(constants.NOS_ALGEMEEN);
        const politiek = downloadFeed(constants.NOS_POLITIEK);

        return Promise.all([algemeen, politiek]).then((feeds) => {

            let promiseFeeds = feeds.map(f => {
                return xmlparser.parseString(f.data);
            });

            return Promise.all(promiseFeeds).then(parsedFeeds => {
                let mergedFeeds = mergeFeeds(parsedFeeds);
                let flattenedFeeds = mergedFeeds.flat();

                setFeedCacheForFeed(constants.NOS_NEWS_CACHE, flattenedFeeds);
                return flattenedFeeds;
            });

        });
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
        console.log("Feed not yet in cache, fetching for: " + feed);
        return true;
    }

    const lastRefreshed = feeds[feed].timestamp;
    const now = new Date().getTime();
    return (now > lastRefreshed + constants.CACHE_REFRESH_DELTA);
}

const setFeedCacheForFeed = (feed, feedData) => {
    console.log("Setting cache feed for: " + feed);
    feeds[feed] = {};
    feeds[feed].timestamp = new Date().getTime();
    feeds[feed].feedData = feedData;
}


const mergeFeeds = (feeds) => {
    return feeds.map(feed => {
        return feed.rss.channel[0].item;
    });
}

/**
 * Nullable check for false
 * 
 * @param {*} feed the feed to get an item for
 * @param {*} index the nr of the item to get from the feed
 */
const getFeedAtIndex = (feed, index) => {
    if (typeof index === 'string' || index instanceof String) {
        index = Number.parseInt(index);
    }
    if (isNaN(index)) index = 0;

    if (!feeds[feed]) {
        console.log("Feed does not exist in cache");
    };

    if ((feeds[feed].feedData.length + 1) < index) {
        console.log("The index is larger than the number of present news items: " + feeds[feed].feedData.length + " vs " + index);
        return false;
    }

    return feeds[feed].feedData[index];
}

exports.downloadFeed = downloadFeed;
exports.downloadMetOogOpMorgen = downloadMetOogOpMorgen;
exports.downloadNOSNews = downloadNOSNews;
exports.getFeedAtIndex = getFeedAtIndex;