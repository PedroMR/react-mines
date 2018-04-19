import React from 'react';
import "./mines.css";
import { connect } from 'react-redux';

function Square(props) {
    let className = "square " + (props.placingFlag ? " square-mode-flag" : " square-mode-inspect");
    if (props.gameOver) className = "square square-mode-over";
    if (props.mine) className += " square-mine";
    else if (props.flag) className += " square-flag square-unseen" + (props.placingFlag ? "-flagging" : "");
    else if (!props.seen) className += " square-unseen" + (props.placingFlag ? "-flagging" : "");
    return <button className={className} onClick={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
    makeSquare(x, y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        const around = this.props.around[pos];
        const mine = seen && this.props.mines[pos];
        const flag = this.props.flags[pos];        
        let value = seen ? (mine ? "*" : around) : "";// (flag? "F" : "");
        if (value === 0) value = "";
        // value = <i class="fas fa-search"></i>;
        // if (value == "F") value = <img src={imgMinefield} className="squareImg"/>;
//             {/* onClick={() => this.props.onClick(x, y)}  */}
        return <Square key={x+","+y} 
             onClick={() => {
                 this.props.dispatch({type:'INSPECT', x:x, y:y});
            }}
            placingFlag={this.props.options.placingFlag}
            mine={mine}
            seen={seen}
            gameOver={this.props.gameOver}
            around={around}
            flag={flag}
            value={value}/>
    }

    render() {
        let rows = []
        for(let i=0; i < this.props.config.y; i++) {
            let row = [] 
            for(let j=0; j < this.props.config.x; j++) {
                row.push(this.makeSquare(j, i));
            }
            rows.push(<div className="board-row" key={i}>{row}</div>);
        }
        return <div className="board">{rows}</div>;
    }
}


function mapStateToProps(state) {
    const propNames = [ 'config', 'seen', 'mines', 'around', 'flags', 'options', 'gameOver'];
    let retVal = {}
    propNames.forEach(name => { retVal[name] = state[name]});
    return retVal;
}
export default connect(mapStateToProps)(Board);
