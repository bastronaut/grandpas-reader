// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');



async function translate(text) {

    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: 'nl-NL', ssmlGender: 'FEMALE', name: 'nl-NL-Wavenet-D' },
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

async function listVoices() {

    const client = new textToSpeech.TextToSpeechClient();

    const [result] = await client.listVoices({});
    const voices = result.voices;

    console.log(voices);
    console.log('Voices:');
    return voices;
    // voices.forEach(voice => {
    //     console.log(`\nName: ${voice.name}`);
    //     console.log(`SSML Voice Gender: ${voice.ssmlGender}`);
    //     console.log(`Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`);
    //     console.log(`Supported languages:`);
    //     voice.languageCodes.forEach(languageCode => {
    //         console.log(`    ${languageCode}`);
    //     });
    // });
}

exports.translate = translate;
exports.listVoices = listVoices;