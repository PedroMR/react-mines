import React from 'react';
import imgInspect from '../img/magnifying-glass.png';
import imgFlag from '../img/minefield.png';
import { Button, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import Items from '../meta/Items';

class MinesPowerList extends React.PureComponent {
    render() {
        const powers = [
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag },
            {item:"auto-zero", desc:"All neighbors of zero tiles are automatically opened." },
            {item:'expand-safe' },
            {item:'color-code' },
            {item:'dont-color-done' },
            {item:'click-surrounded' },
            {item:'error-detection' },
            {item:'mine-first-click' },
            {item:'zero-first-click' },
        ];
        const iconSize = 20;
        
        const powerList = powers.map((power)=> {
            if (power.item) {
                const item = Items.findItemById(power.item);
                if (item) {
                    if (Items.ownsItemId(this.props.items, power.item)) {
                        power.name = item.name;
                        power.desc = item.description;
                    } else {
                        power.name = '-';
                        power.desc = 'Keep playing to unlock this power.'
                    }
                }

            }

            const popover =  <Popover id='{power.name}' title={power.name}>{power.desc}</Popover>;
            const inside = power.icon ? <img src={power.icon} alt="icon" title={power.desc} width={iconSize} height={iconSize}/> : <div  width={iconSize} height={iconSize} style={{display:'inline-block', width:iconSize,height:iconSize}}/>;
            return <OverlayTrigger placement='left' trigger={['hover','focus','click']} rootClose overlay={popover}><div className="minesPower">{inside}<br/>{power.name}</div></OverlayTrigger>;
        })


        return <div className="minesPowerList">POWERS<br/>
        {powerList}</div>;
    }
}

export default MinesPowerList;