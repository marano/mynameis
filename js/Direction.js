function Direction(label, uiElementClasses) {
  this.label = label;
  this.uiElementClasses = uiElementClasses;
}

Direction.NORTH = new Direction('North', []);
Direction.NORTHEAST = new Direction('Northeast', ['horizontalFlip']);
Direction.EAST = new Direction('East', ['horizontalFlip']);
Direction.SOUTHEAST = new Direction('Southeast', ['horizontalFlip']);
Direction.SOUTH = new Direction('South', ['horizontalFlip']);
Direction.SOUTHWEST = new Direction('Southwest', []);
Direction.WEST = new Direction('West', []);
Direction.NORTHWEST = new Direction('Northwest', []);

Direction.ALL_DIRECTIONS = [
  Direction.NORTH,
  Direction.NORTHEAST,
  Direction.EAST,
  Direction.SOUTHEAST,
  Direction.SOUTH,
  Direction.SOUTHWEST,
  Direction.WEST,
  Direction.NORTHWEST
];
