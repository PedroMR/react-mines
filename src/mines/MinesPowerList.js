import React from 'react';
import imgInspect from '../img/magnifying-glass.png';
import imgFlag from '../img/minefield.png';

class MinesPowerList extends React.PureComponent {
    render() {
        const powers = [
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag },
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag },
            {name:"Inspect", desc:"Left-click to see the tile's number", icon: imgInspect },
            {name:"Flag", desc:"Right-click to mark a tile as a mine", icon: imgFlag },
        ];
        const iconSize = 20;

        const powerList = powers.map((power)=> {
            return <div className="minesPower"><img src={power.icon} width={iconSize} height={iconSize}/><br/>{power.name}</div>;
        })

        return <div className="minesPowerList">POWERS<br/>{powerList}</div>;
    }
}

export default MinesPowerList;