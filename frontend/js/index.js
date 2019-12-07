const request = require('browser-request');
const constants = require('./constants');
let globalPodcasts; // global item to make 'nexting' from any view simpler
let currentActivePodcast = 0;

const getPodcasts = () => {

    return new Promise((resolve, err) => {
        request(constants.PODCAST_ENDPOINT, (er, res) => {
            if (er) console.log(er);

            const podcasts = JSON.parse(res.body);
            return resolve(podcasts);
        });
    });

}

const renderPodcasts = () => {
    getPodcasts().then(podcasts => {

        globalPodcasts = podcasts.item;

        if (podcasts.item) {
            for (var i = 0; i < 50; i++) {
                renderPodcastItem(podcasts.item[i], i);
            }
        }

        setupOnclicks();

    }).catch(err => console.log(err));
}

renderPodcastItem = (item, i) => {
    const printNumber = (i + 1) + ".";
    const date = new Date(item.pubDate[0]);
    const printDate = formatDate(date);
    let clone = $("#js-podcast-item-template").clone();
    clone.find("#js-number-indicator").text(printNumber);
    clone.find("#js-title").text(printDate);
    clone.attr("id", "");
    clone.find(".js-podcast-item").attr("audio-item-nr", i);
    $("#js-podcast-items").append(clone);
    clone.show();
}


const formatDate = (date) => {
    var monthNames = [
        "Januari", "Februari", "Maart",
        "April", "Mei", "Juni", "Juli",
        "Augustus", "September", "Oktober",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
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
        $("#js-audio-description").append(formatDate(date));
    }

    hidePodcastItems();
    $("#js-podcast-view").show();
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


const setupOnclicks = () => {

    $(".podcast-item-container").on("click", (e) => {

        let node = $(e.target);
        let podcastNrClicked = getPodcastNrFromClick(node);
        currentActivePodcast = Number(podcastNrClicked);
        showPodcastView(currentActivePodcast);

    });

    $("#js-play-button").on("click", () => {
        hidePlayButton();
        playAudio();
    });

    $("#js-pause-button").on("click", () => {
        hideStopButton();
        pauseAudio();
    });

    $("#js-return-to-overview").on("click", () => {
        clickReturnToOverview();
    });

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

renderPodcasts();
