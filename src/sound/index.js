import blip1 from './assets/blip1.wav';
import blip2 from './assets/blip1.wav';
import boom1 from './assets/boom1.wav';
import coin1 from './assets/coin1.wav';
import {Howl} from 'howler';

let Sound = {
    playTest,
    playSound,
    isMuted,
    setMute,

    REVEAL_NUMBER: 'blip1',
    REVEAL_MINE: 'boom1',
    CLAIM_CREDITS: 'coin1',
    CLAIM_NO_CREDITS: 'blip1',
    PLACING_FLAG: 'coin1',
    
    EXPAND_NUMBER: 'blip1',
    EXPAND_SURROUNDED: 'coin1',

    AUTOCLICK_SAFE: 'blip1',
    AUTOCLICK_SURROUNDED: 'coin1',

    BUY_ITEM: 'coin1',
    CLICK_BUTTON: 'blip1',
    CLICK_BACK: 'blip1',
    END_OF_GAME: null,

    KEY_TYPE: 'blip2',
}
Sound.EXPAND_SURROUNDED = Sound.PLACING_FLAG;

function playTest() {
    console.log("sound",settings.isMuted());
    if (isMuted()) return;
    const sound = new Howl({
        src: boom1
    })
    sound.play();
}

function playSound(soundId, volume = 1.0) {
    if(!soundId) return;
    if (isMuted()) return;

    let howl = findOrMakeHowl(soundId);
    if (howl)
        howl.play();
    howl.volume(volume);

    return howl;
}

let settings = { mute: false };

function isMuted(meta) {
    return settings.mute;
}

function setMute(mute) {
    settings.mute = mute;
}

let SoundSources = {
    blip1,
    blip2,
    boom1,
    coin1,
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