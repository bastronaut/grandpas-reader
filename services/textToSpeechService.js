// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient();

async function translate(text) {

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: 'nl-NL', ssmlGender: 'NEUTRAL' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);

    // console.log('Audio content written to file: output.mp3');
    // console.log(response);

    return response.audioContent;
    // Write the binary audio content to a local file
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile('output.mp3', response.audioContent, 'binary');
    // console.log('Audio content written to file: output.mp3');
}

exports.translate = translate;