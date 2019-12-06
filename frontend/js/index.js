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
            renderPodcastItem(podcasts.item[0]);
        }

    }).catch(err => console.log(err));
}

renderPodcastItem = (item) => {
    console.log(item);
    const date = new Date(item.pubDate[0]);
    const printDate = formatDate(date);
    console.log(printDate);
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