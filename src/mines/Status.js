import React from 'react';
import { connect } from 'react-redux';
import ScoreTally from './ScoreTally';
import Story from '../story/Story';
import { showDialogueLine } from '../story/StoryActions';

class Status extends React.PureComponent {
    render() {
        const countDefined = (acc,val) => (val ? acc+1 : acc);
        const nFlags = this.props.flags.reduce(countDefined, 0);
        const nTotalMines = this.props.mines.reduce(countDefined, 0);
        let nHiddenMines = nTotalMines;
        this.props.mines.forEach((val, index) => { if (val && this.props.seen[index]) nHiddenMines--; });
        const nSeen = this.props.seen.reduce(countDefined, 0);
        const nUnknown = this.props.seen.length - nSeen - nFlags;
        const nClicks = this.props.clicksSoFar || 0;
        let redMinesContent = null;
        const nTotalRedMines = this.props.config.redmines;
        if (nTotalRedMines > 0) {
            const nFoundRed = this.props.special.reduce((acc, val) => (val === 'redFound') ? acc+1 : acc, 0);
            const notFoundRed = nTotalRedMines - nFoundRed;

            redMinesContent = "Found "+nFoundRed+" treasure"+(nFoundRed>1?"s":"")+", "+notFoundRed+" remain" + (notFoundRed===1?"s":"");
            if (notFoundRed > 0) redMinesContent += " (away "+this.props.config.redDistance+" from clues)";
        }

        let topLine = <span className="status end">&nbsp;</span>
        let bottomLine = <span className="status">{nFlags} flag{nFlags===1?"":"s"} / {nHiddenMines} hidden mine{nHiddenMines===1?"":"s"} &mdash; {nClicks} clicks, {nUnknown} tiles left</span>;
        let scoreArea = redMinesContent;

        if (this.props.meta.features["debug-score-tally"] || nUnknown <= 0) {
            if (!Story.hasSeen(this.props.meta, 'first-results'))
                this.props.dispatch(showDialogueLine('first-results'))
            let nCorrectFlags = 0;
            this.props.mines.forEach((val, index) => { if (val && this.props.flags[index]) nCorrectFlags++; });
            const nDetonated = nTotalMines - nHiddenMines;
            topLine = <span className="status end">GAME OVER!</span>;
            bottomLine = <span className="status">{nCorrectFlags} mine{nCorrectFlags===1?"":"s"} found; {nDetonated} mine{nDetonated===1?"":"s"} detonated.</span>;
            scoreArea = <div className="scoreContainer"><ScoreTally results={{nCorrectFlags, nDetonated, noDetonations: nDetonated === 0}}/></div>;
        }

        return <div>{topLine}{bottomLine}{scoreArea}</div>;
            
    }
}


function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'flags', 'mines', 'clicksSoFar', 'special' ];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.mines[name]});

    retVal.meta = state.meta;
    return retVal;
}

export default connect(mapStateToProps)(Status);
