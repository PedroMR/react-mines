import blip1 from './assets/blip1.wav';
import boom1 from './assets/boom1.wav';
import coin1 from './assets/coin1.wav';
import {Howl} from 'howler';

const Assets =  {
    blip1,
    boom1,
    coin1,
}

let Sound = {
    playTest,
    playSound,

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
    END_OF_GAME: null,
}
Sound.EXPAND_SURROUNDED = Sound.PLACING_FLAG;

function playTest() {
    console.log("sound");
    const sound = new Howl({
        src: boom1
    })
    sound.play();
}

function playSound(soundId) {
    if(!soundId) return;

    let howl = findOrMakeHowl(soundId);
    if (howl)
        howl.play();
}

let SoundSources = {
    blip1,
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