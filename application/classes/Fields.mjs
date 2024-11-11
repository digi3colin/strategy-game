class Field{
  key = '';
  typeId = null;
  level = 0;

  constructor(level=0) {
    this.level = level;
  }
}

class WoodCutter extends Field{
  key = 'wood_cutter';
  typeId = 0;
}

class ClayPit extends Field{
  key = 'clay_pit';
  typeId = 1;
}

class IronMine extends Field{
  key = 'iron_mine';
  typeId = 2;
}

class Cropland extends Field {
  key = 'cropland';
  typeId = 3;
}

export {
  WoodCutter,
  ClayPit,
  IronMine,
  Cropland
}