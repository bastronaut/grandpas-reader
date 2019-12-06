var parseString = require('xml2js').parseString;

const parseXMLString = (xml) => {

    return new Promise((resolve, reject) => parseString(xml, (err, result) => {
        if (err) reject(err);
        resolve(result);
    }));
}


exports.parseString = parseXMLString;