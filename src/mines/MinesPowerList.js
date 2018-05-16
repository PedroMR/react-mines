import React from 'react';
import imgInspect from '../img/magnifying-glass.png';
import imgFlag from '../img/minefield.png';
import { Button, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import * as types from '../types';

class MinesPowerList extends React.PureComponent {
    render() {
        const powers = [
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag },
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
            if (power.feature) {
                const hasFeature = this.props.hasFeature(power.feature);
                if (!hasFeature) {
                    power.name = '-';
                    power.desc = 'Keep playing to unlock this power.'
                }
            }

            const popover =  <Popover id='{power.name}' title={power.name}>{power.desc}</Popover>;
            const inside = power.icon ? <img src={power.icon} alt="icon" title={power.desc} width={iconSize} height={iconSize}/> : <div  width={iconSize} height={iconSize} style={{display:'inline-block', width:iconSize,height:iconSize}}/>;
            return <OverlayTrigger key={power.name+power.feature} placement='left' trigger={['hover','focus','click']} rootClose overlay={popover}><div className="minesPower">{inside}<br/>{power.name}</div></OverlayTrigger>;
        })


        return <div className="minesPowerList">POWERS<br/>
        {powerList}</div>;
    }
}

export default MinesPowerList;