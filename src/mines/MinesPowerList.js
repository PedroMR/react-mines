import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as types from '../types';
import imgBlank from '../img/20x20.png';
import { powerCatalogue, toolCatalogue } from '../conf/PowerDatabase';

class MinesPowerList extends React.PureComponent {
    render() {
        const iconSize = 20;

        const powerList = powerCatalogue.map((power)=> {
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
            return <OverlayTrigger key={power.name+power.feature} placement='bottom' trigger='click' rootClose overlay={popover}><div onClick={onFeatureClick} className={powerClass}>{inside}<br/>{label}</div></OverlayTrigger>;
        });

        const toolList = toolCatalogue.map((power) => {
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
            const isCurrentMode = power.mode && this.props.currentMode === power.mode;
            const powerClass = isCurrentMode ? "minesPower minesPowerActive" : "minesPower";
            const popoverTitle = power.name + (isDisabled ? ' (disabled)' : '');
            const usesLeft = power.tool ? this.props.getToolAmount(power.tool) : 0;
            const limitedUses = power.tool ? true : false;
            const showUsesLeft = limitedUses && ownsFeature;
            const usesLabel = showUsesLeft ? <div className='minesPowerUses'>{usesLeft}</div> : null;
            const canBeSelected = ownsFeature && power.mode && (!limitedUses || usesLeft > 0);
            const onFeatureClick = canBeSelected ? (() => { this.props.onSetMode(power.mode); }) : null; 
            const { hotkey } = power;

            const popover =  <Popover id='{power.name}' title={popoverTitle}>
                (Hotkey: <b>{hotkey}</b>)<br/>{power.desc}<hr/>
                {showUsesLeft ? ("Uses left: "+usesLeft) : " "}
            </Popover>;
            const inside = power.icon ? <img src={power.icon} alt="icon" title={power.desc} /> : <div  width={iconSize} height={iconSize} style={{display:'inline-block', width:iconSize,height:iconSize}}/>;
            return <OverlayTrigger key={power.name+power.tool} placement='bottom' trigger={['hover', 'focus']} rootClose overlay={popover}>
                <div onClick={onFeatureClick} className={powerClass}>{inside}<br/>{label}<br/>{usesLabel}</div></OverlayTrigger>;
        });

        return <div className="minesPowerList">
            TOOLS<br/>{toolList}<br clear='both'/>
            POWERS<br/>{powerList}</div>;
    }
}

export default MinesPowerList;