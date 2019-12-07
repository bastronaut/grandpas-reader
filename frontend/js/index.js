var request = require('browser-request');
var constants = require('./constants');


const getPodcasts = () => {

    return new Promise((resolve, err) => {
        request(constants.PODCAST_ENDPOINT, function (er, res) {
            if (er) console.log(er);

            const podcasts = JSON.parse(res.body);
            return resolve(podcasts);
        });
    });

}

const renderPodcasts = () => {
    getPodcasts().then(podcasts => {
        if (podcasts.item) {
            for (var i = 0; i < 50; i++) {
                renderPodcastItem(podcasts.item[i], i);
            }
        }

        setupOnclicks();

    }).catch(err => console.log(err));
}

renderPodcastItem = (item, i) => {
    console.log(item);
    const printNumber = (i + 1) + ".";
    const date = new Date(item.pubDate[0]);
    const printDate = formatDate(date);
    let clone = $("#js-podcast-item-template").clone();
    clone.find("#js-number-indicator").text(printNumber);
    clone.find("#js-title").text(printDate);
    clone.attr("id", "");
    clone.attr("audio-src", item.link);
    clone.attr("audio-description", item.description);
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

renderPodcasts();


const hidePodcastItems = () => {
    $("#js-podcast-items").hide();
}
const showPodcastItems = () => {
    $("#js-podcast-items").show();
}

const hidePodcastView = () => {
    $("#js-podcast-view").hide();
}
const showPodcastView = () => {
    $("#js-podcast-view").show();
}

const clickPlayButton = () => {
    $("#js-play-button").hide();
    $("#js-pause-button").show();
    document.getElementById("js-audio-player").play();
}

const clickStopButton = () => {
    $("#js-play-button").show();
    $("#js-pause-button").hide();
    document.getElementById("js-audio-player").pause();
}

const clickReturnToOverview = () => {
    hidePodcastView();
    showPodcastItems();

}

hidePodcastItems();
showPodcastView();




const setupOnclicks = () => {

    $(".podcast-item-container").on("click", (e) => {
        console.log(5);
        console.log(this);
        console.log(e);
    })


    $("#js-play-button").on("click", () => {
        clickPlayButton();
    })

    $("#js-pause-button").on("click", () => {
        clickStopButton();
    })

    $("#js-return-to-overview").on("click", () => {
        clickReturnToOverview();
    })
}



$(window).click(function (e) {
    console.log(e.target); // then e.srcElement.className has the class
});