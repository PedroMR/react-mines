import React from 'react';
import * as types from '../types';

class ControlPanel extends React.PureComponent {
    onClickFlag() {
        this.props.onToggleFlag();
    }

    render() {
        let mode = "Inspecting";
        switch(this.props.options.uiMode) {
            case types.UI_MODE_FLAG: mode = "Flags"; break;
            case types.UI_MODE_MARK_RED: mode = "Digging Up"; break;
            default: mode = "Inspecting"; break;
        }

        return <div id="controlPanel">
            <button onClick={()=>this.onClickFlag()} autoFocus
                >Change Mode [F]</button> {mode} <br/>
            {this.props.config.x}x{this.props.config.y}, {this.props.config.mines} mines<br/><br/><br/>
        </div>;
    }
}

export default ControlPanel;