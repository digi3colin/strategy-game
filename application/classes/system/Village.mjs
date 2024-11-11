import dayjs from 'dayjs';
import {fieldData} from './Data.mjs';

class SystemVillage {

  static clone(village){
    return {
      production: [...village.production],
      storage: [...village.storage],
      storageMax: [...village.storageMax],
      jobs: village.jobs.map(it => ({...it})),
      buildings: village.buildings.map(it => ({...it})),
      updated_at: village.updated_at,
    }
  }

  /**
   *
   * @param {*} villageState
   * @param {string} now
   * @returns {*}
   */
  static read (villageState, now){
    const village = this.clone(villageState);

    //sort jobs by done
    village.jobs.sort((a, b) => dayjs(b.done).diff(a.done));

    //check if there is a job and done is less than now
    village.jobs = village.jobs.map(job => {
      if(dayjs(job.done).diff(now) > 0) return job; //job is not done
      this.process(village, job.done);// calculate storage at the time of job done
      job.action(village); // do the job
      return null;
    }).filter(j => j !== null);

    return this.process(village, now);
  }

  /**
   *
   * @param {*} village
   * @param {string} now
   * @returns {*}
   */
  static process (village, now) {
    const diff = dayjs(now).diff(village.updated_at, 'hour', true);

    village.storage = village.storage
      .map((s, i) =>  village.production[i] * diff + s) //calculate new storage
      .map((s, i) => s > village.storageMax[i] ? village.storageMax[i] : s); //check if storage is full
    village.updated_at = now;
    return village;
  }

  static timeToSecond(time){
    const [hour, minute, second] = time.split(':').map(Number);
    return hour * 3600 + minute * 60 + second;
  }
  static upgrade(village, buildingIndex, now){
    const result = this.read(village, now);
    const building = result.buildings[buildingIndex];

    //do the upgrade
    const data = fieldData[building.key];
    const {cost, time} = data[building.level + 1];

    result.storage.forEach((s, i) => {
      result.storage[i] -= cost[i];
      if(result.storage[i] < 0) throw new Error('Not enough resources');
    })

    //push job
    result.jobs.push({
      done: dayjs(result.updated_at).add(this.timeToSecond(time), 'second').toISOString().replace('.000Z', 'Z'),
      action: village => {
        const building = village.buildings[buildingIndex];
        building.level++;
        village.production = this.calculateProductions(village);
      }
    })

    return result;
  }

  static calculateProductions(village){
    const productions = [0,0,0,0];
    for(let i=0; i< 18; i++) {
      const field = village.buildings[i];
      const production = fieldData[field.key][field.level].production;
      productions[field.typeId] += production;
    }
    return productions;
  }
}

class Field{
  key = '';
  typeId = null;
  level = 0;
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

class Building{

}

class Village{
  updated_at = '';
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
  SystemVillage,
  Village,
  WoodCutter,
  ClayPit,
  IronMine,
  Cropland
}
