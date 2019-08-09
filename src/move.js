const Move = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  makeMove(player, order) {
    this.value = player.letter;
    this.order = order;
    this.description = this.order + '. ' + player.name + ' moved ' + this.value + ' to (' + this.x  + ', ' + this.y + ')';
  }
}

export default Move;
