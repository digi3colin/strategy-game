import {SystemVillage} from '../application/classes/system/Village.mjs';
import {Village} from '../application/classes/Village.mjs';

describe('Game Test', () => {
  test('new game', async ()=>{
    const v = new Village('2024-11-09T00:00:00Z');
    expect(v.storage.join(',')).toBe('400,400,400,400');
  })

  test('new game after 1 hour', async ()=>{
    const v = new Village('2024-11-09T00:00:00Z');
    const v2 = SystemVillage.read(v, '2024-11-09T01:00:00Z');
    expect(v2.storage.join(',')).toBe('400,400,400,400');
    expect(v.storage.join(',')).toBe(v2.storage.join(','));
    expect(v.production.join(',')).toBe(v2.production.join(','));
    expect(v.buildings.map(b => b.level).join(',')).toBe(v2.buildings.map(b => b.level).join(','));
    expect(v.buildings[0] === v2.buildings[0]).toBe(false);
  })

  test('build cropland', async ()=>{
    const v = new Village('2024-11-09T00:00:00Z');
    const v2 = SystemVillage.upgrade(v, 1, '2024-11-09T01:00:00Z')
    expect(v2.storage.join(',')).toBe('330,310,330,380');
    expect(v2.jobs[0].done).toBe('2024-11-09T01:02:30Z');

    const v2b = SystemVillage.read(v2, '2024-11-09T01:01:00Z')
    expect(v2b.storage.join(',')).toBe('330,310,330,380');
    expect(v2b.production.join(',')).toBe('0,0,0,0');

    const v2c = SystemVillage.read(v2, '2024-11-09T01:02:30Z');
    expect(v2c.storage.join(',')).toBe('330,310,330,380');
    expect(v2c.production.join(',')).toBe('0,0,0,5');

    const v3 = SystemVillage.read(v2, '2024-11-09T02:02:30Z');
    expect(v3.production.join(',')).toBe('0,0,0,5');
    expect(v3.storage.join(',')).toBe('330,310,330,385');
  })
})