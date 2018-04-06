function Square(props) {
    return <div className="square">{props.value}</div>;
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        
    }

    makeSquare(x, y) {
        return <Square key={x+","+y} value={x+y}/>
    }

    render() {
        let rows = []
        for(let i=0; i < this.props.size.y; i++) {
            let row = [] 
            for(let j=0; j < this.props.size.x; j++) {
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

        this.state = {}
        this.state.size = {x: 10, y: 6};

    }

    render() {
        return <div
            ><h1>REACT Minesweeper</h1>
            <Board size={this.state.size}/>
            </div>;
    }
}


ReactDOM.render(<Game/>,
document.getElementById('root')
);

