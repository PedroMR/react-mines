import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';

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
        let bottomLine = <span className="status">{nFlags} flags / {nHiddenMines} hidden mines &mdash; {nUnknown} tiles</span>;

        if (nUnknown <= 0) {
            let nCorrectFlags = 0;
            this.props.mines.forEach((val, index) => { if (val && this.props.flags[index]) nCorrectFlags++; });
            topLine = <span className="status end">GAME OVER!</span>;
            bottomLine = <span className="status">{nCorrectFlags} mines found; {nTotalMines - nHiddenMines} mines detonated.</span>;
        }

        return <div>{topLine}{bottomLine}</div>;
    }
}


function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'flags', 'mines', 'options'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state[name]});
    return retVal;
}

export default connect(mapStateToProps)(Status);
