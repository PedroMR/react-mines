function Square(props) {
    let className = "square";
    if (props.mine) className += " square-mine";
    else if (!props.seen) className += " square-unseen";
    return <button className={className} onClick={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        
    }

    makeSquare(x, y) {
        const pos = x + y*this.props.config.x;
        const seen = this.props.seen[pos];
        const around = this.props.around[pos];
        const mine = seen && this.props.mines[pos];
        let value = seen ? (mine ? "*" : around) : "";
        return <Square key={x+","+y} 
            onClick={() => this.props.onClick(x, y)}
            mine={mine}
            seen={seen}
            around={around}
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

class Game extends React.Component {
    constructor(props) {
        super(props);

        let cols = 10;
        let rows = 6;
        let nMines = 8;
        this.state = {}
        this.state.config = {x: cols, y: rows};
        this.state.seen = Array(cols*rows).fill(false);
        this.state.around = Array(cols*rows).fill(0);
        this.state.mines = Array(cols*rows).fill(false);

        while(nMines > 0) {
            let randX = getRandomInt(cols);
            let randY = getRandomInt(rows);
            let pos = randX+cols*randY;
            if (!this.state.mines[pos]) {
                nMines--;
                this.state.mines[pos] = true;
                for (let dy=-1; dy <= 1; dy++) {
                    if (randY + dy < 0 || randY + dy >= cols) continue;
                    for (let dx=-1; dx <= 1; dx++) {
                        if (randX + dx < 0 || randX + dx >= cols) continue;                        
                        let neighborPos =  pos + dx + dy*cols;
                        this.state.around[neighborPos]++;
                    }
                }
            }
        }
    }

    handleClick(x, y) {
        const index = x + y * this.state.config.x;
        let seen = this.state.seen.slice();
        if (!seen[index]) {
            seen[index] = true;
            this.setState({seen: seen});
        }
    }

    render() {
        return <div
            ><h1>REACT Minesweeper</h1>
            <Board
             config={this.state.config}
             seen={this.state.seen}
             mines={this.state.mines}
             around={this.state.around}
             onClick={(x,y) => this.handleClick(x,y)}
             />
            </div>;
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

ReactDOM.render(<Game/>,
document.getElementById('root')
);

