const axios = require('axios');
const constants = require('../utils/constants')

const downloadFeed = (feedUrl) => {
    return axios.get(feedUrl);
}

// returns xml string 
const downloadMetOogOpMorgen = (feedUrl) => {
    return downloadFeed(constants.NOS_OOG_OP_MORGEN_PODCAST);
}

exports.downloadFeed = downloadFeed;
exports.downloadMetOogOpMorgen = downloadMetOogOpMorgen;