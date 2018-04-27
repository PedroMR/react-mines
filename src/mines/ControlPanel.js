import React from 'react';
import * as types from '../types';

class ControlPanel extends React.PureComponent {
    onClickFlag() {
        this.props.onToggleFlag();
    }

    render() {
        const mode = this.props.options.uiMode === types.UI_MODE_FLAG ? "Flags" : "Inspecting";

        return <div id="controlPanel">
            <button onClick={()=>this.onClickFlag()} autoFocus
                >Change Mode [F]</button> {mode} <br/>
            {this.props.config.x}x{this.props.config.y}, {this.props.config.mines} mines<br/><br/><br/>
        </div>;
    }
}

export default ControlPanel;