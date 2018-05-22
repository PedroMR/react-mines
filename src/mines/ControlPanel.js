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
            case types.UI_MODE_KILL_MINE: mode = "Killing a Mine"; break; //TODO maybe add "8 left"
            default: mode = "Inspecting"; break;
        }

        return <div id="controlPanel">
            {mode} <br/>
            {this.props.config.x}x{this.props.config.y}, {this.props.config.mines} mines<br/><br/><br/>
        </div>;
    }
}

export default ControlPanel;