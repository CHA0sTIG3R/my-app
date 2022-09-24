import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function calculateWinner(squares) {
    const lines = [
        { rule: 1, winner: [0, 1, 2] },
        { rule: 2, winner: [3, 4, 5] },
        { rule: 3, winner: [6, 7, 8] },
        { rule: 4, winner: [0, 3, 6] },
        { rule: 5, winner: [1, 4, 7] },
        { rule: 6, winner: [2, 5, 8] },
        { rule: 7, winner: [0, 4, 8] },
        { rule: 8, winner: [2, 4, 6] }
    ];
    let theWinner = lines.find( e => {
        const [a, b, c] = e.winner;
        let stat = (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]);
        return stat;
    }) || { rule: 1, winner: [] };
    let isWinner = squares[theWinner.winner[0]];
    let combo = theWinner.winner;
    return {isWinner, combo};
}

function Square(props) {
    return (
        <button className={"square " + (props.winner? "square-winner" : null)} onClick={props.onClick}>
            {props.value}
        </button>
    );
}


  
function Board(props) {

    let rows = [];

    function renderSquare(i) {
        let col = []
        for (let j = i; j < i+3; j++){
            col.push(<Square key={j} winner={props.winner.includes(j)} value={props.squares[j]} onClick={() => props.onClick(j)}/>);
        }
        return col;
    }

    for (let j = 0; j < 8; j+=3){
        rows.push(<div key={j} className="board-row">{renderSquare(j)}</div>)
    }

    return (
        <div>{rows}</div>
    );
}
  
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                index: 0,
            }],
            stepNumber: 0,
            isNext: true,
        }
    }

    clickHandler = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const curr = this.state.history[history.length - 1];
        const squares = curr.squares.slice();
        if (calculateWinner(squares).isWinner || squares[i]){
            return;
        }
        squares[i] = this.state.isNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                index: i,
            }]),
            stepNumber: history.length,
            isNext: !this.state.isNext,
        });
    }

    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            isNext: (step % 2) === 0,
        });
        
    }

    render() {
        const history = this.state.history;
        const curr = history[this.state.stepNumber];
        const winner = calculateWinner(curr.squares);

        const moves = history.map((step, move) => {
            const col = step.index % 3;
            const row = Math.floor(step.index / 3);
            const desc = move ? 'Go to move #' + move + ' Position ('+ col +','+ row + ')' : 'Go to game start';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner.isWinner){
            status = 'Winner: ' + winner.isWinner;
        }else{
            status = 'Next player: '+ (this.state.isNext ? 'X': 'O');
        }
        return (
            <div className="game">
            <div className="game-board">
                <Board
                    squares={curr.squares}
                    winner={winner.isWinner? winner.combo : []}
                    onClick={(i) => this.clickHandler(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  