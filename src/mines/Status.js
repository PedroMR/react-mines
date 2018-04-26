import React from 'react';
import { connect } from 'react-redux';
import * as tools from '../Tools';
import ScoreTally from './ScoreTally';

class Status extends React.PureComponent {
    render() {
        const countDefined = (acc,val) => (val ? acc+1 : acc);
        const nFlags = this.props.flags.reduce(countDefined, 0);
        const nTotalMines = this.props.config.mines;
        let nHiddenMines = nTotalMines;
        this.props.mines.forEach((val, index) => { if (val && this.props.seen[index]) nHiddenMines--; });
        const nSeen = this.props.seen.reduce(countDefined, 0);
        const nUnknown = this.props.seen.length - nSeen - nFlags;

        let topLine = <span className="status end">&nbsp;</span>
        let bottomLine = <span className="status">{nFlags} flag{nFlags===1?"":"s"} / {nHiddenMines} hidden mine{nHiddenMines===1?"":"s"} &mdash; {nUnknown} tiles</span>;
        let scoreArea = null;

        if (nUnknown <= 0) {
            let nCorrectFlags = 0;
            this.props.mines.forEach((val, index) => { if (val && this.props.flags[index]) nCorrectFlags++; });
            const nDetonated = nTotalMines - nHiddenMines;
            topLine = <span className="status end">GAME OVER!</span>;
            bottomLine = <span className="status">{nCorrectFlags} mine{nCorrectFlags===1?"":"s"} found; {nDetonated} mine{nDetonated===1?"":"s"} detonated.</span>;
            scoreArea = <ScoreTally results={{nCorrectFlags, nDetonated}}/>;
        }

        return <div>{topLine}{bottomLine}{scoreArea}</div>;
            
    }
}


function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'flags', 'mines' ];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state.game[name]});

    retVal.meta = state.meta;
    return retVal;
}

export default connect(mapStateToProps)(Status);
