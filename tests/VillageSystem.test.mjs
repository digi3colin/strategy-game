import {SystemVillage} from '../application/classes/system/Village.mjs';
import {Cropland} from '../application/classes/Fields.mjs';

describe('Village System Test', () => {
  const defaultVillage = {
    production: [1000,1000,1000,1000],
    storage:[0,0,0,0],
    storageMax:[8000,8000,8000,8000],
    updated_at: '2024-11-09T05:35:00Z',
    buildings: [
      new Cropland(),
    ],
    jobs:[
      {action: 'upgrade', bid: 0, done: '2024-11-09T08:35:00Z'}
    ]
  }

  test('immutable', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T06:00:00Z');
    expect(village).not.toBe(defaultVillage);
    expect(village !== defaultVillage).toBe(true);
  });

  test('read at same time', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T05:35:00Z');
    expect(village.storage.join(',')).toBe('0,0,0,0');
  });

  test('read at 1 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T06:35:00Z');
    expect(village.storage.join(',')).toBe('1000,1000,1000,1000');
  });

  test('read at 1.5 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T07:05:00Z');
    expect(village.jobs.length).toBe(1);
    expect(village.storage.join(',')).toBe('1500,1500,1500,1500');
  });

  test('read at 3 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T08:35:00Z');
    expect(village.storage.join(',')).toBe('3000,3000,3000,3000');
    expect(village.production.join(',')).toBe('0,0,0,5');
    expect(village.jobs.length).toBe(0);
  });

  test('read at 4 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T09:35:00Z');
    expect(village.storage.join(',')).toBe('3000,3000,3000,3005');
    expect(village.production.join(',')).toBe('0,0,0,5');
    expect(village.jobs.length).toBe(0);
  });

  test('check full', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T13:35:00Z');
    expect(village.storage.join(',')).toBe('3000,3000,3000,3025');
    expect(village.production.join(',')).toBe('0,0,0,5');
    expect(village.jobs.length).toBe(0);
  });
});