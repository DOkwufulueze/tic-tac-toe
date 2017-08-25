import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function ToggleButton(props) {
  return (
    <button className='toggle-button' onClick={() => props.onClick()}>Sort Moves in {props.sortDirection}</button>
  );
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isXNext: true,
      stepNumber: 0,
      movesSorting: 1,
    };
  }

  handleClick(index) {
    let historyCopy = this.state.history.slice();
    const history = historyCopy.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squaresCopy = current.squares.slice();
    const result = calculateWinner(squaresCopy) || [];
    if (result[0] || squaresCopy[index]) return;
    squaresCopy[index] = this.state.isXNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squaresCopy,
      }]),
      isXNext: !this.state.isXNext,
      stepNumber: history.length,
    });
  }

  jumpTo(move) {
    this.setState({
      isXNext: (move % 2) === 0,
      stepNumber: move,
    });
  }

  handleMovesSorting() {
    this.setState({
      movesSorting: (this.state.movesSorting === 1 ? 0 : 1),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares) || [];
    const [winner, winningSquares] = result;

    const moves = history.map((ignore, move) => {
      const description = move ? `Move #${move}` : "Game Start";
      return (
        <li key={move} style={move === this.state.stepNumber ? {fontWeight: "bold"} : {fontWeight: "normal"}}>
          <a href="#" onClick={() => this.jumpTo(move)}>{description}</a>
        </li>
      );
    });

    if (this.state.movesSorting === 0) moves.reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = `Next player: ${ this.state.isXNext ? 'X' : 'O' }`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(index) => this.handleClick(index)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="moves-toggle-button">
            <ToggleButton
              sortDirection={this.state.movesSorting === 1 ? "Desc" : "Asc"}
              onClick={() => this.handleMovesSorting()}
            />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const winningSquares = this.props.winningSquares || [];
    return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isWinningSquare={winningSquares.includes(i)}
          />;
  }

  render() {
    let rowBoxes = Array(9).fill(0).map((ignore, index) => {
      return this.renderSquare(index);
    });

    let squareGrid = Array(3).fill(0).map((ignore, index) => {
      let startPosition = 3 * index;
      let endPosition = (3 * (index + 1));
      return (
        <div key={index} className="board-row">
          {rowBoxes.slice(startPosition, endPosition)}
        </div>
      );
    });

    return (
      <div>
        {squareGrid}
      </div>
    );
  }
}

function Square(properties) {
  return (
    <button className="square" onClick={properties.onClick} style={properties.isWinningSquare ? {background: "#efba11"} : {background: "#ffffff"}}>
      {properties.value}
    </button>
  );
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
      return [squares[a], [a, b, c]];
    }
  }

  return null;
}
