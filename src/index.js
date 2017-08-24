import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function resetGame(props) {
//   return (
//     <button className='reset-game' onClick=
//   );
// }

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

function Square(properties) {
  return (
    <button className="square" onClick={properties.onClick}>
      {properties.value}
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      isXNext: true,
    }
  }

  renderSquare(i) {
    return <Square
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
          />;
  }

  handleClick(index) {
    let squaresCopy = this.state.squares.slice();
    if (calculateWinner(squaresCopy) || squaresCopy[index]) return;
    squaresCopy[index] = this.state.isXNext ? 'X' : 'O';
    this.setState({
      squares: squaresCopy,
      isXNext: !this.state.isXNext,
    });
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = `Next player: ${ this.state.isXNext ? 'X' : 'O' }`;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />, document.getElementById('root')
);

function calculateWinner(squares) {
  // Each lines entry is the group of entries that must be alike [horizontally, vertically, and/or diagonally]

  const lines = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
    [0, 3, 6], // column 1
    [1, 4, 7], // column 2
    [2, 5, 8], // column 3
    [0, 4, 8], // diagonal [top-left to bottom-right]
    [2, 4, 6], // diagonal [top-right to bottom-left]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
