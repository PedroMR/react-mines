import blip1 from './assets/blip1.wav';
import boom1 from './assets/boom1.wav';
import coin1 from './assets/coin1.wav';
import {Howl} from 'howler';

let Sound = {
    playTest,
    playSound,

    BLIP: 'blip',
    BOOM: 'boom',
    COIN: 'coin',
}

function playTest() {
    console.log("sound");
    const sound = new Howl({
        src: boom1
    })
    sound.play();
}

function playSound(soundId) {
    let howl = findOrMakeHowl(soundId);
    if (howl)
        howl.play();
}

let SoundSources = {
    [Sound.BLIP]: blip1,
    [Sound.BOOM]: boom1,
    [Sound.COIN]: coin1,
};
let cachedHowls = {}

function findOrMakeHowl(soundId) {
    if (!cachedHowls[soundId]) {
        const sources = SoundSources[soundId];
        if (!sources) {
            console.error("No sources for soundId "+soundId);
            return null;
        }
        cachedHowls[soundId] = new Howl({src: sources});
    }
    return cachedHowls[soundId];
}



export default Sound;