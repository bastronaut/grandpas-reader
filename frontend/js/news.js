const request = require('browser-request');
const constants = require('./constants');
const util = require('./util');

let globalNewsItems; // lazy global item to make 'nexting' and 'preving' simpler
let currentActiveNewsItem = 0;


const getFeed = (endpoint) => {
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

        setupNewsOnClicks();
    }).catch(err => console.log(err));
}



const hidePodcastItems = () => {
    $("#js-podcast-items").hide();
}
const showPodcastItems = () => {
    $("#js-podcast-items").show();
    hidePodcastView();
}

const hidePodcastView = () => {
    hideStopButton();
    $("#js-podcast-view").hide();

}

const showPodcastView = (activePodcastNr) => {

    let activePodcast = globalPodcasts[activePodcastNr];
    if (activePodcast && activePodcast.description) {
        $("#js-audio-description").text(activePodcast.description[0]);
    }
    if (activePodcast && activePodcast.link) {
        $("#js-audio-player").attr("src", activePodcast.link[0]);
    }

    if (activePodcast && activePodcast.pubDate) {
        const date = new Date(activePodcast.pubDate[0]);
        $("#js-audio-description").append("<br />");
        $("#js-audio-description").append(util.formatDate(date));
    }

    hidePodcastItems();
    $("#js-podcast-view").show();
    hideStopButton();
}

const hidePlayButton = () => {
    $("#js-play-button").hide();
    $("#js-pause-button").show();

}

const hideStopButton = () => {
    $("#js-play-button").show();
    $("#js-pause-button").hide();
}

const clickReturnToOverview = () => {
    pauseAudio();
    showPodcastItems();
}


const setupPodcastOnclicks = () => {

    $(".podcast-item-container").on("click", (e) => {

        let node = $(e.target);
        let podcastNrClicked = getPodcastNrFromClick(node);
        currentActivePodcast = Number(podcastNrClicked);
        showPodcastView(currentActivePodcast);

    });

    // Play button on Podcast view page
    $("#js-play-button").on("click", () => {
        hidePlayButton();
        playAudio();
    });

    // Pause button on Podcast view page
    $("#js-pause-button").on("click", () => {
        hideStopButton();
        pauseAudio();
    });

    // Back to list view button
    $("#js-return-to-overview").on("click", () => {
        clickReturnToOverview();
    });

    // Next podcast button
    $("#js-next-item").on("click", () => {
        currentActivePodcast = currentActivePodcast + 1;
        showPodcastView(currentActivePodcast);
    })

    const audio = document.getElementsByTagName("audio")[0];
    audio.addEventListener("playing", function () { hidePlayButton(); }, true);
    audio.addEventListener("pause", function () { hideStopButton(); }, true);


}

// Podcast nr is stored in element in dom, but onclick may have fired from child node
const getPodcastNrFromClick = (element) => {
    if (element.hasClass("js-podcast-item") || element.is('body')) {
        return element.attr("audio-item-nr");
    }
    return getPodcastNrFromClick(element.parent());
}


const pauseAudio = () => {
    document.getElementById("js-audio-player").pause();
}

const playAudio = () => {
    document.getElementById("js-audio-player").play();
}



const renderNewsItem = (newsItem) => {
    console.log(newsItem);
    $("#js-news-title").text(newsItem.title[0]);
    $("#js-news-description").html(newsItem.description[0]);

    const date = new Date(newsItem.pubDate[0]);
    const printDate = util.formatDate(date);

    $("#js-news-date").text(printDate);
}

const determineTextToSpeak = () => {
    return new DOMParser().parseFromString($("#js-text-to-speak"), "text/html")
        .documentElement.textContent;
}


const setupNewsOnClicks = () => {


}

const getAudio = (text) => {

    request.post(constants.SYNTHESIZE_ENDPOINT, {
        json: { "text": text }
    }).then(result => {
        
    })

    
}
renderNews();

