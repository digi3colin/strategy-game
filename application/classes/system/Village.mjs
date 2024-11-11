import dayjs from 'dayjs';
import {fieldData} from './Data.mjs';

class SystemVillage {
  /**
   *
   * @param {*} villageState
   * @param {string} now
   * @returns {*}
   */
  static read (villageState, now){
    const village = JSON.parse(JSON.stringify(villageState));

    //sort jobs by done
    village.jobs.sort((a, b) => dayjs(b.done).diff(a.done));

    //check if there is a job and done is less than now
    village.jobs = village.jobs.map(job => {
      if(dayjs(job.done).diff(now) > 0) return job; //job is not done
      this.process(village, job.done);// calculate storage at the time of job done

      switch (job.action) {
        case 'upgrade':
          const building = village.buildings[job.bid];
          building.level++;
          break;
        default:
      }

      this.calculateProductions(village);
    }).filter(j => !!j);

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
      action: 'upgrade',
      bid: buildingIndex,
      done: dayjs(result.updated_at).add(this.timeToSecond(time), 'second').toISOString().replace('.000Z', 'Z'),
    })

    return result;
  }

  static calculateProductions(village){
    const productions = [0,0,0,0];
    let culturePoints = 0;
    for(let i=0; i< 18; i++) {
      const field = village.buildings[i];
      if(!field) continue;
      const data = fieldData[field.key][field.level];
      const production = data.production;
      productions[field.typeId] += production;
      productions[3] -= data.crop;
      culturePoints += data.cp;
    }

    village.production = productions;
    village.culturePoint = culturePoints;
  }
}

class Building{

}

export {
  SystemVillage,
}
