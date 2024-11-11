import {ClayPit, Cropland, IronMine, WoodCutter} from "./Fields.mjs";

class Village{
  updated_at = '';
  culturePoint = 0;
  production= [0,0,0,0];
  storage= [400,400,400,400];
  storageMax= [800,800,800,800];
  /**
   *
   * @type {Field|Building[]} buildings
   */
  buildings= [];
  jobs = [];

  constructor(date){
    this.buildings = [
      new WoodCutter(),
      new Cropland(),
      new WoodCutter(),
      new IronMine(),
      new ClayPit(),
      new ClayPit(),
      new IronMine(),
      new Cropland(),
      new Cropland(),
      new IronMine(),
      new IronMine(),
      new Cropland(),
      new Cropland(),
      new WoodCutter(),
      new Cropland(),
      new ClayPit(),
      new WoodCutter(),
      new ClayPit(),
    ];

    this.updated_at = date;
  }
}

export {
  Village
}