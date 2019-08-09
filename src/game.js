import React from 'react'
import Move from './move'
import Player from './player'
import Board from './board'
import StatusMessage from './statusMessage'
import History from './history'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

const STATS_STORAGE_ITEM_NAME = 'stats'; 
const DEFAULT_STATS = { wins: 0, losses: 0, ties: 0, percentage: 0 };

const Game = class extends React.Component {
  static winningMoves = [
    [
      {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}
    ],
    [
      {x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}
    ],
    [
      {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}
    ],
    [
      {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}
    ],
    [
      {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}
    ],
    [
      {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}
    ],
    [
      {x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}
    ],
    [
      {x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}
    ],
  ];

  static defaultMoves() {
    let moves = Array(0);
    for (let x=0; x < 3; x++) {
      for (let y=0; y < 3; y++) {
        moves.push(new Move(x,y));
      }
    }
    return moves.slice();
  }

  static defaultPlayers() {
    let letters = ['X', 'O'];
    if (Math.floor(Math.random() * 1000) % 2 === 0) letters.reverse();

    let players = [new Player('You', letters[0]), new Player('Computer', letters[1], false)];
    if (Math.floor(Math.random() * 1000) % 2 === 0) players.reverse();

    return players.slice();
  }

  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATS,
      step: 0,
      moves: Game.defaultMoves(),
      players: Game.defaultPlayers(),
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    if (this.isComputerMove()) this.computerMove();
  }

  currentPlayer() {
    return this.state.players[0];
  }

  isHumanMove() {
    return this.currentPlayer().isHuman;
  }

  isComputerMove() {
    return this.currentPlayer().isComputer();
  }

  isGameOver() {
    return this.state.hasWinner || this.state.isCatsGame;
  }

  getStats() {
    return JSON.parse(localStorage.getItem(STATS_STORAGE_ITEM_NAME));
  }

  setStats(object) {
    localStorage.setItem(STATS_STORAGE_ITEM_NAME, JSON.stringify(object));
  }

  incrementStats() {
    const stats = this.getStats() || { ...DEFAULT_STATS };
    
    if (this.isGameOver()) {
      if (this.state.isCatsGame) {
        stats.ties += 1;
      } else if (this.isHumanMove()) {
        stats.wins += 1;
      } else {
        stats.losses += 1;
      }

      stats.percentage = Number.parseFloat(
                          stats.wins/(stats.wins + stats.losses + stats.ties)*100
                        ).toPrecision(3);

      this.setStats(stats);
      this.setState(stats);
    }
  }

  move(x,y) {
    if (this.isGameOver()) return;

    const moves = this.state.moves.slice();
    const move = moves.find((move) => {
      return move.x === x && move.y === y;
    });

    if (!move) throw Error('Invalid position');
    if (move.value) return;

    let moveIndex = moves.findIndex((move) => {
      return move.x === x && move.y === y;
    });

    let moveOrder = moves.filter((move) => {
      return move.value;
    }).length;

    move.makeMove(this.currentPlayer(), moveOrder + 1);
    moves[moveIndex] = move;

    let winningMoves = this.calculateWinningMoves(moves);
    let isCatsGame = this.isCatsGame(moves);

    let newState = {
      step: this.state.step + 1,
      moves: moves,
      lastMove: move,
      hasWinner: !!winningMoves,
      isCatsGame: isCatsGame,
    }

    if (!winningMoves && !isCatsGame) {
      newState.players = this.state.players.reverse();
    }

    this.setState(newState, () => {
        this.incrementStats();
        this.computerMove();
      }
    );
  }

  computerMove() {
    if (this.isHumanMove() || this.isGameOver()) return;
    const moves = this.state.moves.slice();
    const availableMoves = moves.filter((move) => !move.value);
    const player = this.currentPlayer();
    let bestMove = null;

    // Computer attempts to make a winning move by moving into an empty spot in a row where
    // computer already has two moves
    availableMoves.forEach(availableMove => {
      const testMove = {...availableMove, value: player.letter};
      let testMoves = moves.slice().concat(testMove);

      for (let i=0; i < Game.winningMoves.length; i++) {
        const [a, b, c] = Game.winningMoves[i];
        const moveA = testMoves.find((move) => move.value === player.letter && move.x === a.x && move.y === a.y);
        const moveB = testMoves.find((move) => move.value === player.letter && move.x === b.x && move.y === b.y);
        const moveC = testMoves.find((move) => move.value === player.letter && move.x === c.x && move.y === c.y);
        if (moveA && moveB && moveC && moveA.value === moveB.value && moveA.value === moveC.value) {
          bestMove = availableMove;
        }
      }
    });

    // Computer attempts to block a winning move by moving into an empty spot in a row where
    // the human player already has two moves
    if (!bestMove) {
      let letter = (player.letter === 'X') ? 'O' : 'X';

      availableMoves.forEach(availableMove => {
        const testMove = {...availableMove, value: letter};
        let testMoves = moves.slice().concat(testMove);

        for (let i=0; i < Game.winningMoves.length; i++) {
          const [a, b, c] = Game.winningMoves[i];
          const moveA = testMoves.find((move) => move.value === letter && move.x === a.x && move.y === a.y);
          const moveB = testMoves.find((move) => move.value === letter && move.x === b.x && move.y === b.y);
          const moveC = testMoves.find((move) => move.value === letter && move.x === c.x && move.y === c.y);
          if (moveA && moveB && moveC && moveA.value === moveB.value && moveA.value === moveC.value) {
            bestMove = availableMove;
          }
        }
      });
    }

    // If there are no clear winning or blocking moves,
    // then the computer just chooses a move at random.
    // We could add additional 'intelligence' by choosing
    // a random move from a row where at least the computer
    // has made one other move or just scrap all this logic
    // in favor of the strategy employed by Newell and Simon's
    // 1972 game: https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
    if (!bestMove) {
      bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    setTimeout(() => this.move(bestMove.x, bestMove.y), 1000);
  }

  calculateWinningMoves(moves) {
    for (let i=0; i < Game.winningMoves.length; i++) {
      const [a, b, c] = Game.winningMoves[i];
      const moveA = moves.find((move) => move.x === a.x && move.y === a.y);
      const moveB = moves.find((move) => move.x === b.x && move.y === b.y);
      const moveC = moves.find((move) => move.x === c.x && move.y === c.y);

      if (moveA.value && moveA.value === moveB.value && moveA.value === moveC.value) {
        return moveA.highlight = moveB.highlight = moveC.highlight = (this.isComputerMove() ? 'computer' : 'human');
      };
    }
    return false;
  }

  isCatsGame(moves) {
    for (let i=0; i<moves.length; i++) {
      let move = moves[i];
      if (!move.value) return false;
    }
    return true;
  }

  jumpTo(step) {
    this.setState({step: step});
  }

  reset() {
    this.setState({
        step: 0,
        moves: Game.defaultMoves(),
        players: Game.defaultPlayers(),
        hasWinner: false,
        isCatsGame: false,
      },
      () => this.computerMove()
    );
  }

  render() {
    const moves = this.state.moves.filter((move) => {
      return move.order >= 0;
    }).sort((a, b) => {
      return a.order - b.order;
    });

    const { wins, losses, ties, percentage } = this.state;

    return (
      <div>
        <Navbar fluid={true}>
          <Navbar.Header>
            <Navbar.Brand>Tic-Tac-Toe</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={ this.reset }>New Game</NavItem>
            </Nav>
            <Nav>
              <History
                showHistory={ this.isGameOver() }
                moves={ moves }
                step={ this.state.step }
                currentPlayer={ this.currentPlayer() }
                jumpTo={ (i) => this.jumpTo(i) }
              />
            </Nav>
            <Nav pullRight>
              <NavItem disabled>
                Record: { wins } - { losses } - { ties } ({ percentage }%)
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <StatusMessage
          hasWinner={ this.state.hasWinner }
          isCatsGame={ this.state.isCatsGame }
          currentPlayer={ this.currentPlayer() }
        />
        <Board
          moves={ moves.slice(0, this.state.step) }
          totalMoves={ moves.length }
          isHumanMove={ this.isHumanMove() }
          step={ this.state.step }
          onClick={ (x, y) => this.move(x, y) }
        />
        <footer className="footer container-fluid">
          <div className="row">
            <div className="col-lg-6">Created by Mike Bradford</div>
            <div className="col-lg-6 text-right"><a href="https://github.com/47primes/tic-tac-toe.js">View Source Code on Github</a></div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Game;
