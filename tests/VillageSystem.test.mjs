import {SystemVillage} from '../application/classes/system/Village.mjs';

describe('Village System Test', () => {
  const defaultVillage = {
    production: [1000,1000,1000,1000],
    storage:[0,0,0,0],
    storageMax:[8000,8000,8000,8000],
    updated_at: '2024-11-09T05:35:00Z',
    buildings: [],
    jobs:[
      {action: village => { village.production[3] += 100; }, done: '2024-11-09T08:35:00Z'}
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
    expect(village.storage.join(',')).toBe('1500,1500,1500,1500');
  });

  test('read at 3 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T08:35:00Z');
    expect(village.storage.join(',')).toBe('3000,3000,3000,3000');
    expect(village.production.join(',')).toBe('1000,1000,1000,1100');
  });

  test('read at 4 hour', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T09:35:00Z');
    expect(village.storage.join(',')).toBe('4000,4000,4000,4100');
    expect(village.production.join(',')).toBe('1000,1000,1000,1100');
  });

  test('check full', async () => {
    const village = SystemVillage.read(defaultVillage, '2024-11-09T13:35:00Z');
    expect(village.storage.join(',')).toBe('8000,8000,8000,8000');
    expect(village.production.join(',')).toBe('1000,1000,1000,1100');
  });
});