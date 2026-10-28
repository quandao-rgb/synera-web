import test from 'node:test';
import assert from 'node:assert/strict';
import { createTruckAnimationEngine, TRUCK_ANIMATION, TRUCK_VIEWS, truckRear, truckView } from '../frontend/components/landing/truck-animation-engine.mjs';
import { audienceTruckPoint, findAudienceTruckZone, audienceTruckLayout } from '../frontend/components/landing/audience-truck-zone.mjs';

test('All eight local travel directions select a frame and emit smoke behind the vehicle', () => {
  for (const [vx, vy, expected] of [[100,0,'e'],[100,-100,'ne'],[0,-100,'n'],[-100,-100,'nw'],[-100,0,'w'],[-100,100,'sw'],[0,100,'s'],[100,100,'se']]) {
    const view = truckView(vx, vy); assert.equal(view, expected);
    const rear = truckRear({ x: 0, y: 0, view }); assert.ok(rear.x * vx + rear.y * vy < 0);
  }
  assert.equal(new Set(Object.values(TRUCK_VIEWS).map(view => `${view.column},${view.row}`)).size, 8);
  assert.equal(truckView(100, 50, 'e'), 'e'); assert.equal(truckView(100, 50, 'se'), 'se');
  assert.equal(truckView(0, 0, 'n'), 'n');
});
test('The whole vehicle stays in the white strip and never intersects text/icon rectangles for a full minute', () => {
  for (const [width, height, obstacles] of [
    [1900,137,[{left:200,right:640,top:45,bottom:95},{left:1140,right:1700,top:50,bottom:85}]],
    [1440,110,[{left:120,right:510,top:30,bottom:80},{left:800,right:1320,top:35,bottom:75}]],
    [1280,120,[{left:40,right:430,top:30,bottom:80},{left:700,right:1240,top:35,bottom:75}]],
  ]) {
    const zone = findAudienceTruckZone(width, height, obstacles); assert.ok(zone);
    const engine = createTruckAnimationEngine(() => 0.5);
    for (let time = 0; time < 60_000; time += 32) {
      const point = audienceTruckPoint(time, zone.width, zone.height);
      engine.move(point.x, point.y, time); engine.step(time);
      const x = zone.left + engine.truck.x, y = zone.top + engine.truck.y;
      const halfWidth = TRUCK_ANIMATION.width / 2 + 3, halfHeight = TRUCK_ANIMATION.height / 2 + 3;
      assert.ok(x - halfWidth >= 0 && x + halfWidth <= width);
      assert.ok(y - halfHeight >= 0 && y + halfHeight <= height);
      for (const rect of obstacles) assert.ok(x + halfWidth <= rect.left || x - halfWidth >= rect.right || y + halfHeight <= rect.top || y - halfHeight >= rect.bottom);
    }
  }
});
test('Insufficient whitespace disables the decoration instead of changing content layout', () => {
  assert.equal(findAudienceTruckZone(1100,110,[{left:24,right:1076,top:20,bottom:90}]), null);
  assert.equal(findAudienceTruckZone(1440,60,[]), null);
  const zone = findAudienceTruckZone(1440,140,[]); assert.ok(zone.width <= 520);
});

test('Refreshed compact landing fits the truck without growing the strip or overlapping content', () => {
  const width = 1440, height = 82.75;
  const obstacles = [{left:120,right:460,top:29,bottom:53.75},{left:800,right:1320,top:30,bottom:53}];
  assert.equal(findAudienceTruckZone(width, height, obstacles), null);
  const zone = audienceTruckLayout(width, height, obstacles);
  assert.ok(zone); assert.ok(zone.scale >= 0.75 && zone.scale < 1);
  const engine = createTruckAnimationEngine(() => 0.5);
  for (let time = 0; time < 60_000; time += 32) {
    const point = audienceTruckPoint(time, zone.width / zone.scale, zone.height / zone.scale);
    engine.move(point.x, point.y, time); engine.step(time);
    const x = zone.left + engine.truck.x * zone.scale, y = zone.top + engine.truck.y * zone.scale;
    const halfWidth = (TRUCK_ANIMATION.width / 2 + 3) * zone.scale, halfHeight = (TRUCK_ANIMATION.height / 2 + 3) * zone.scale;
    assert.ok(x - halfWidth >= 0 && x + halfWidth <= width);
    assert.ok(y - halfHeight >= 0 && y + halfHeight <= height);
    for (const rect of obstacles) assert.ok(x + halfWidth <= rect.left || x - halfWidth >= rect.right || y + halfHeight <= rect.top || y - halfHeight >= rect.bottom);
  }
  assert.equal(audienceTruckLayout(1440, 60, []), null);
  assert.equal(audienceTruckLayout(1440, 140, []).scale, 1);
});
