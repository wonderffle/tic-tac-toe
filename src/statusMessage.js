import React, { Component } from 'react'

const StatusMessage = class extends Component {
  render() {
    let status;
    if (this.props.hasWinner) {
      if (this.props.currentPlayer.isHuman) {
        status = 'You Win!';
      } else {
        status = 'Computer Wins!';
      }
    } else if (this.props.isCatsGame) {
      status = 'Cat\'s Game!';
    } else {
      if (this.props.currentPlayer.isHuman) {
        status = 'Your Move: ';
      } else {
        status = 'Computer Move: ';
      }
      status += this.props.currentPlayer.letter;
    }

    return(
      <h2 className="text-center">{status}</h2>
    );
  }
}

export default StatusMessage;
