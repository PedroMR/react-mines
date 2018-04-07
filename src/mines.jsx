function Square(props) {
    const className = "square" + (props.seen ? "": " square-unseen");
    return <button className={className} onClick={props.onClick}>{props.value}</button>;
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        
    }

    makeSquare(x, y) {
        const seen = this.props.seen[x + y*this.props.config.x];
        let value = seen ? "!" : "";
        return <Square key={x+","+y} onClick={() => this.props.onClick(x, y)} seen={seen} value={value}/>
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
        this.state.around = Array(cols*rows).fill(null);
        this.state.mines = Array(cols*rows).fill(false);

        // while(nMines > 8)
    }

    handleClick(x, y) {
        const index = x + y * this.state.config.x;
        let seen = this.state.seen.slice();
        seen[index] = true;
        this.setState({seen: seen});
    }

    render() {
        return <div
            ><h1>REACT Minesweeper</h1>
            <Board
             config={this.state.config}
             seen={this.state.seen}
             around={this.state.around}
             onClick={(x,y) => this.handleClick(x,y)}
             />
            </div>;
    }
}


ReactDOM.render(<Game/>,
document.getElementById('root')
);

