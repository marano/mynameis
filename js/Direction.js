function Direction(label, uiElementClasses) {
  this.label = label;
  this.uiElementClasses = uiElementClasses;
}

Direction.NORTH = new Direction('North', []);
Direction.EAST = new Direction('East', ['horizontalFlip']);
Direction.SOUTH = new Direction('South', ['horizontalFlip']);
Direction.WEST = new Direction('West', []);

Direction.ALL_DIRECTIONS = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
];
