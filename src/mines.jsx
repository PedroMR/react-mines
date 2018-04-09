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
        const flag = this.props.flags[pos];        
        let value = seen ? (mine ? "*" : around) : (flag? "F" : "");
        return <Square key={x+","+y} 
            onClick={() => this.props.onClick(x, y)}
            mine={mine}
            seen={seen}
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

class ControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            choosingGameOptions: false,
            x: props.config.x,
            y: props.config.y,
            mines: props.config.mines,
        }
    }

    handleXChanged(val) {
        this.setState({x: val});
    }

    handleYChanged(val) {
        this.setState({y: val});
    }

    handleMinesChanged(val) {
        this.setState({mines: val});
    }

    onNewGameButton() {
        this.setState({choosingGameOptions: true});
    }

    onCreateGameButton() {
        this.setState({choosingGameOptions: false});
        this.props.onNewGame(this.state);
    }

    onClickFlag() {
        this.props.options.placingFlag = !this.props.options.placingFlag;
        this.props.onChange(this.props.options);
    }

    render() {
        const mode = this.props.options.placingFlag ? "Placing Flag" : "Peeking";
        const config = this.props.config;

        const newGame = this.state.choosingGameOptions ?
            <div id="newGameOpt"> 
                New game<br/>
                Rows: <input type="text" defaultValue={config.y} onChange={(e)=>this.handleYChanged(e.target.value)}/><br/>
                Columns: <input type="text" defaultValue={config.x} onChange={(e)=>this.handleXChanged(e.target.value)}/><br/>
                Mines: <input type="text" defaultValue={config.mines} onChange={(e)=>this.handleMinesChanged(e.target.value)}/><br/>
                <button onClick={()=>this.onCreateGameButton()}>Create Game</button>
            </div> 
            : <button onClick={()=>this.onNewGameButton()}>New Game</button>;

        return <div id="controlPanel">
            <button onClick={()=>this.onClickFlag()}>Change Mode</button> {mode} <br/>
            {config.x}x{config.y}, {config.mines} mines<br/><br/><br/>
            {newGame}
        </div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        let cols = 10;
        let rows = 6;
        let nMines = 8;
        let config = {x: cols, y: rows, mines: nMines};
        this.createGame(config);
    }

    createGame(config) {
        let cols = config.x;
        let rows = config.y;
        config.mines = Math.min(config.mines, cols * rows);

        let nMines = config.mines;

        let state = {}
        state.options = { placingFlag: false };
        state.config = {x: cols, y: rows, mines: nMines};
        state.seen = Array(cols*rows).fill(false);
        state.around = Array(cols*rows).fill(0);
        state.mines = Array(cols*rows).fill(false);
        state.flags = Array(cols*rows).fill(false);

        while(nMines > 0) {
            let randX = getRandomInt(cols);
            let randY = getRandomInt(rows);
            let pos = randX+cols*randY;
            if (!state.mines[pos]) {
                nMines--;
                state.mines[pos] = true;
                for (let dy=-1; dy <= 1; dy++) {
                    if (randY + dy < 0 || randY + dy >= rows) continue;
                    for (let dx=-1; dx <= 1; dx++) {
                        if (randX + dx < 0 || randX + dx >= cols) continue;                        
                        let neighborPos =  pos + dx + dy*cols;
                        state.around[neighborPos]++;
                    }
                }
            }
        }

        if (this.state)
            this.setState(state);
        else
            this.state = state;
    }

    handleClick(x, y) {
        const pos = x + y * this.state.config.x;
        let seen = this.state.seen.slice();

        if (!seen[pos]) {
            if (this.state.options.placingFlag) {
                let flags = this.state.flags.slice();
                flags[pos] = !flags[pos];
                this.setState({flags: flags});
            } else {
                seen[pos] = true;
                this.setState({seen: seen});
            }
        } else {
            //expand
            var flagsAround = this.countFlagsAround(x, y);
            if (flagsAround == this.state.around[pos]) {
                this.expandAround(x,y);
            }
        }
    }

    countFlagsAround(x, y) {
        let n = 0;
        let cols = this.state.config.x;
        let rows = this.state.config.y;

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                let neighborPos =  x + dx + (y+dy)*cols;
                if (this.state.flags[neighborPos])
                    n++;
            }
        }

        return n;
    }

    expandAround(x, y) {
        let cols = this.state.config.x;
        let rows = this.state.config.y;
        let seen = this.state.seen.slice();        

        for (let dy=-1; dy <= 1; dy++) {
            if (y + dy < 0 || y + dy >= rows) continue;
            for (let dx=-1; dx <= 1; dx++) {
                if (x + dx < 0 || x + dx >= cols) continue;                        
                let neighborPos =  x + dx + (y+dy)*cols;
                if (!this.state.flags[neighborPos])
                    seen[neighborPos] = true;
            }
        }
        this.setState({seen: seen});
    }

    handleOptionsChanged(newOptions) {
        this.setState({options: newOptions});
    }

    render() {
        return <div
            ><h1>REACT Minesweeper</h1>
            <Board
             config={this.state.config}
             seen={this.state.seen}
             mines={this.state.mines}
             around={this.state.around}
             flags={this.state.flags}
             onClick={(x,y) => this.handleClick(x,y)}
             />
             <ControlPanel
             options={this.state.options}
             config={this.state.config}
             onChange={(newOptions) => this.handleOptionsChanged(newOptions)}
             onNewGame={(c) => this.createGame(c)}
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

