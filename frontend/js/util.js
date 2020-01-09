exports.formatDate = (date) => {
    let monthNames = [
        "Januari", "Februari", "Maart",
        "April", "Mei", "Juni", "Juli",
        "Augustus", "September", "Oktober",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}


exports.flashNext = () => {

    $("#js-flash-overlay").removeClass("JS-flash-overlay-back");
    $("#js-flash-overlay").addClass("JS-flash-overlay-next");
    $("#js-flash-overlay").show();

    window.setTimeout(() => {
        $("#js-flash-overlay").hide();
    }, 150)
}

exports.flashPrevious = () => {
    $("#js-flash-overlay").removeClass("JS-flash-overlay-next");
    $("#js-flash-overlay").addClass("JS-flash-overlay-back");
    $("#js-flash-overlay").show();

    window.setTimeout(() => {
        $("#js-flash-overlay").hide();
    }, 150)
}