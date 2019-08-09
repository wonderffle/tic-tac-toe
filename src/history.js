import React, { Component } from 'react'
import { Popover, OverlayTrigger, NavItem, ListGroup, ListGroupItem } from 'react-bootstrap';

const History = class extends Component {
  render() {
    const moves = [{order: 0, description: 'Beginning of Game'}, ...this.props.moves];
    const history = moves.map((move) => {
      return (
        <ListGroupItem
          bsStyle={move.order === this.props.step ? 'warning' : null}
          key={move.order}
          onClick={() => (this.props.showHistory ? this.props.jumpTo(move.order) : null)}
        >
          <div>{move.description}</div>
        </ListGroupItem>
      );
    });

    const popoverBottom = (
      <Popover id="popover-positioned-bottom">
        <ListGroup>
          {history}
        </ListGroup>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
        <NavItem>
          History
        </NavItem>
      </OverlayTrigger>
    );
  }
}

export default History;
