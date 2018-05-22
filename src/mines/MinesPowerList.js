import React from 'react';
import imgInspect from '../img/magnifying-glass.png';
import imgFlag from '../img/minefield.png';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as types from '../types';
import imgBlank from '../img/20x20.png';

class MinesPowerList extends React.PureComponent {
    render() {
        const tools = [
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect, mode: types.UI_MODE_REVEAL },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag, mode: types.UI_MODE_FLAG },
            {feature:types.FEATURE_RED_MINES, name:"Dig Up Treasure", desc:"Dig a tile for treasure.", icon: imgInspect, mode: types.UI_MODE_MARK_RED, noToggle: true, tool: types.TOOL_MARK_RED},
            {feature:types.FEATURE_MINE_KILLER, name:"Kill a Mine", desc:"Kill a mine if there is one there.", icon: imgFlag, mode: types.UI_MODE_KILL_MINE, noToggle: true, tool: types.TOOL_KILL_MINE },
        ]
        const powers = [
            {feature:types.FEATURE_ZERO_OUT, name:"Auto-zero", desc:"All neighbors of zero tiles are automatically opened." },
            {feature:types.FEATURE_EXPAND, name:"Safe Expansion", desc:"Click a number which can't have any more mines around it to inspect unseen tiles."},
            {feature:types.FEATURE_COLOR_NUMBERS, name:"Colored Numbers", desc:"Green numbers are surrounded by enough flagged mines; all unseen tiles around a red number must be mines."},
            {feature:types.FEATURE_DONT_COLOR_DONE, name:"Grey Numbers", desc:"Grey numbers are surrounded by visible or flagged tiles, so you don't need to worry about them."},
            {feature:types.FEATURE_CLICK_SURROUNDED, name:"Surrounded Expansion", desc:"You can click red numbers to automatically flag their unseen neighbours." },
            {feature:types.FEATURE_ERROR_DETECTION, name:"Error Detection", desc:"Tiles surrounded by too many flags will get highlighted." },
            {feature:types.FEATURE_SAFE_FIRST_CLICK, name:"Mine Mulligan", desc:"You are guaranteed not to hit a mine with your first click." },
            {feature:types.FEATURE_ZERO_FIRST_CLICK, name:"Non-zero Mulligan", desc:"You are guaranteed not to hit a zero with your first click." },
        ];
        const iconSize = 20;

        const powerList = powers.map((power)=> {
            let canToggleFeature = !power.noToggle;
            if (power.feature) {
                const ownsFeature = this.props.ownsFeature(power.feature);
                if (!ownsFeature) {
                    canToggleFeature = false;
                    power.name = '-';
                    power.desc = 'Keep playing to unlock this power.'
                }
            } else {
                canToggleFeature = false;
            }
            power.icon = power.icon || imgBlank;
            
            const onToggleClick = canToggleFeature ? (() => { this.props.onToggleFeature(power.feature); }) : null;
            const isDisabled = this.props.isFeatureDisabled(power.feature);
            const label = <div className='minesPowerName'>{isDisabled ? "(disabled)" : power.name}</div>; 
            const onFeatureClick = power.mode ? (() => { this.props.onSetMode(power.mode); }) : null; 
            const isCurrentMode = power.mode && this.props.currentMode === power.mode;
            const powerClass = isCurrentMode ? "minesPower minesPowerActive" : "minesPower";

            const popoverTitle = power.name + (isDisabled ? ' (disabled)' : '');
            const popover =  <Popover id='{power.name}' title={popoverTitle}>{power.desc}<hr/><Button disabled={!canToggleFeature} onClick={onToggleClick}>Disable</Button></Popover>;
            const inside = power.icon ? <img src={power.icon} alt="icon" title={power.desc} /> : <div  width={iconSize} height={iconSize} style={{display:'inline-block', width:iconSize,height:iconSize}}/>;
            return <OverlayTrigger key={power.name+power.feature} placement='bottom' trigger={['hover', 'active']} rootClose overlay={popover}><div onClick={onFeatureClick} className={powerClass}>{inside}<br/>{label}</div></OverlayTrigger>;
        });

        const toolList = tools.map((power) => {
            let canToggleFeature = false;
            let ownsFeature = true;
            if (power.feature) {
                ownsFeature = this.props.ownsFeature(power.feature);
                if (!ownsFeature) {
                    power.name = '-';
                    power.desc = 'Keep playing to unlock this tool.'
                }
            }
            const onToggleClick = null;
            const isDisabled = this.props.isFeatureDisabled(power.feature);
            const label = <div className='minesPowerName'>{isDisabled ? "(disabled)" : power.name}</div>; 
            const onFeatureClick = power.mode ? (() => { this.props.onSetMode(power.mode); }) : null; 
            const isCurrentMode = power.mode && this.props.currentMode === power.mode;
            const powerClass = isCurrentMode ? "minesPower minesPowerActive" : "minesPower";
            const popoverTitle = power.name + (isDisabled ? ' (disabled)' : '');
            const usesLeft = power.tool ? this.props.getToolAmount(power.tool) : 0;
            const limitedUses = power.tool ? true : false;
            const showUsesLeft = limitedUses && ownsFeature;

            const popover =  <Popover id='{power.name}' title={popoverTitle}>
                {power.desc}<hr/>
                {showUsesLeft ? ("Uses left: "+usesLeft) : " "}
            </Popover>;
            const inside = power.icon ? <img src={power.icon} alt="icon" title={power.desc} /> : <div  width={iconSize} height={iconSize} style={{display:'inline-block', width:iconSize,height:iconSize}}/>;
            return <OverlayTrigger key={power.name+power.tool} placement='bottom' trigger={['hover', 'active']} rootClose overlay={popover}><div onClick={onFeatureClick} className={powerClass}>{inside}<br/>{label}</div></OverlayTrigger>;
        });

        return <div className="minesPowerList">
            TOOLS<br/>{toolList}<br clear='both'/>
            POWERS<br/>{powerList}</div>;
    }
}

export default MinesPowerList;