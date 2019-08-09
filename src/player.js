const Player = class {
  constructor(name, letter, isHuman=true) {
    this.name = name;
    this.letter = letter;
    this.isHuman = isHuman;
  }

  isComputer() {
    return !this.isHuman;
  }
}

export default Player;
