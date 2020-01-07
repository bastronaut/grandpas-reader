// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');



async function translate(text) {

    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
        input: { ssml: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: 'nl-NL', ssmlGender: 'MALE', name: 'nl-NL-Wavenet-A' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    return response.audioContent;
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