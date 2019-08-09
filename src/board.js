import React, { Component } from 'react'

const Board = class extends Component {
  squareStyle(x, y) {
    const style = {borderColor: '#999'};
    if (x === 2 && y === 2) {
      style.borderWidth = '1px 0px 0px 1px';
    } else if (x === 2 && y === 1) {
      style.borderWidth = '1px 0px 0px 1px';
    } else if (x === 2 && y === 0) {
      style.borderWidth = '1px 0px 0px 0px';
    } else if (x === 1 && y === 2) {
      style.borderWidth = '1px 0px 0px 1px';
    } else if (x === 1 && y === 1) {
      style.borderWidth = '1px 0px 0px 1px';
    } else if (x === 1 && y === 0) {
      style.borderWidth = '1px 0px 0px 0px';
    } else if (x === 0 && y === 2) {
      style.borderWidth = '0px 0px 0px 1px';
    } else if (x === 0 && y === 1) {
      style.borderWidth = '0px 0px 0px 1px';
    } else {
      style.borderWidth = '0px';
    }
    return style;
  }

  isCurrentlySelectedMove(move) {
    return move && move === this.props.moves[this.props.moves.length - 1];
  }

  isNotLastMoveOfGame() {
    return this.props.moves.length < this.props.totalMoves;
  }

  isLastMoveOfGame() {
    return this.props.moves.length === this.props.totalMoves;
  }

  squareClassName(move) {
    return 'square ' + (move && move.highlight && this.isLastMoveOfGame() ? move.highlight + '-highlight' : '');
  }

  renderSquare(x, y) {
    const move = this.props.moves.find((move) => {
      return move.x === x && move.y === y;
    });

    const style = this.squareStyle(x, y);
    if (this.isCurrentlySelectedMove(move) && this.isNotLastMoveOfGame()) {
      style.background = '#fcf8e3';
    }

    return <button
      key={x + '' + y}
      style={style}
      className={this.squareClassName(move)}
      onClick={() => (this.props.isHumanMove ? this.props.onClick(x, y) : null)}>
      {(move ? move.value : null)}
    </button>;
  }

  renderBoard() {
    let board = [];
    for (let x=0; x<3; x++) {
      let children = [];
      for (let y=0; y<3; y++) {
        children.push(this.renderSquare(x, y));
      }
      board.push(<div key={x} className="board-row">{children}</div>);
    }
    return board;
  }

  render() {
    return (
      <div className="game">
        <div className="game-board center-block">
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

export default Board;
