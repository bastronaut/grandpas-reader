const request = require('browser-request');
const constants = require('./constants');
const util = require('./util');

let globalNewsItems; // lazy global item to make 'nexting' and 'preving' simpler
let currentActiveNewsItem = 0;


const getFeed = (endpoint) => {
    currentActiveNewsItem = 0;

    return new Promise((resolve, err) => {
        request(endpoint, (er, res) => {
            if (er) console.log(er);

            const podcasts = JSON.parse(res.body);
            return resolve(podcasts);
        });
    });
}


const renderNews = () => {

    getFeed(constants.NEWS_ENDPOINT).then(news => {
        globalNewsItems = news.result;
        renderNewsItem(globalNewsItems[0]);

        setupOnclicks();
    }).catch(err => console.log(err));
}


const hidePlayButton = () => {
    $("#js-play-news-button").hide();
    $("#js-pause-news-button").show();

}

const hideStopButton = () => {
    $("#js-play-news-button").show();
    $("#js-pause-news-button").hide();
}


const setupOnclicks = () => {

    // Play button 
    $("#js-play-news-button").on("click", () => {
        hidePlayButton();
        playAudio();
    });

    // Pause button 
    $("#js-pause-news-button").on("click", () => {
        hideStopButton();
        pauseAudio();
    });

    // Previous news item button click
    $("#js-prev-news-item").on("click", () => {
        currentActiveNewsItem = currentActiveNewsItem - 1;

        if (currentActiveNewsItem == 0) hidePrevButton();
        if (currentActiveNewsItem < globalNewsItems.length - 1) showNextButton();


        renderNewsItem(globalNewsItems[currentActiveNewsItem]);
    });

    // Next news item button click
    $("#js-next-news-item").on("click", () => {
        currentActiveNewsItem = currentActiveNewsItem + 1;

        if (currentActiveNewsItem > 0) showPrevButton();
        if (currentActiveNewsItem == globalNewsItems.length - 1) hideNextButton();

        renderNewsItem(globalNewsItems[currentActiveNewsItem]);
    })

    const audio = document.getElementsByTagName("audio")[0];
    audio.addEventListener("playing", function () { hidePlayButton(); }, true);
    audio.addEventListener("pause", function () { hideStopButton(); }, true);


}

const showPrevButton = () => {
    $("#js-prev-news-item").show();
}
const hidePrevButton = () => {
    $("#js-prev-news-item").hide();
}

const showNextButton = () => {
    $("#js-prev-news-item").show();
}
const hideNextButton = () => {
    $("#js-prev-news-item").hide();
}

const pauseAudio = () => {
    document.getElementById("js-news-audio-player").pause();
}

const playAudio = () => {
    document.getElementById("js-news-audio-player").play();
}

const renderNewsItem = (newsItem) => {
    console.log(newsItem);
    $("#js-news-title").text(newsItem.title[0]);
    $("#js-news-description").html(newsItem.description[0]);

    const date = new Date(newsItem.pubDate[0]);
    const printDate = util.formatDate(date);

    $("#js-news-date").text(printDate);

    const endpoint = determineSynthEndpoint();
    console.log(endpoint);
    $("#js-news-audio-player").attr("src", endpoint);
}

const determineSynthEndpoint = () => {
    return constants.SYNTHESIZE_ENDPOINT + '?' +
        constants.FEED_PARAM + '=' + constants.NOS_NEWS_FEED +
        '&' + constants.FEED_NR_PARAM + '=' + currentActiveNewsItem;
}

const determineSynthEndpointTitleOnly = () => {
    return constants.SYNTHESIZE_ENDPOINT + '?' +
        constants.FEED_PARAM + '=' + constants.NOS_NEWS_FEED +
        '&' + constants.FEED_NR_PARAM + '=' + currentActiveNewsItem +
        '&' + constants.FEED_TITLE_ONLY_PARAM + '=1';
}

const determineSynthEndpointDateOnly = () => {
    return constants.SYNTHESIZE_ENDPOINT + '?' +
        constants.FEED_PARAM + '=' + constants.NOS_NEWS_FEED +
        '&' + constants.FEED_NR_PARAM + '=' + currentActiveNewsItem +
        '&' + constants.FEED_DATE_ONLY_PARAM + '=1';

}

/**
 * Need a refresh mechanism so that grandpa does not need to restart the app
 */
const setupRefreshMechanism = () => {
    console.log("Checking for refresh...");
    window.setTimeout(() => {
        runRefreshCheck();
        setupRefreshMechanism();
    }, 20 * 1000)
}

const runRefreshCheck = () => {
    const lastRefreshed = getLastRefreshTimestamp();
    const day = 1 * 60 * 60 * 24 * 1000; // 1 day
    const now = new Date().getTime();


    if (now > (lastRefreshed + day)) {
        console.log("Refreshing, longer than a day ago!");
        renderNews();
        setLastRefreshTimestamp();
    } else {
        console.log("No refresh needed, back to sleep");
    }


}

const getLastRefreshTimestamp = () => {
    if (localStorage.getItem(constants.LAST_REFRESHED_VAR)) {
        return new Date(Number.parseInt(localStorage.getItem(constants.LAST_REFRESHED_VAR))).getTime();
    } else {
        // First page load
        return setLastRefreshTimestamp();
    }
}

const setLastRefreshTimestamp = () => {
    const lastRefreshed = new Date().getTime();
    localStorage.setItem(constants.LAST_REFRESHED_VAR, lastRefreshed);
    return lastRefreshed;
}

renderNews();
setupRefreshMechanism();

