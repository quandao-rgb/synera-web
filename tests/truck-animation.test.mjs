import test from 'node:test';
import assert from 'node:assert/strict';
import { createTruckAnimationEngine, TRUCK_ANIMATION, truckAnimationEnabled, truckRear } from '../frontend/components/landing/truck-animation-engine.mjs';

test('Truck enhancement is disabled for touch, narrow screens and reduced motion', () => {
  const normal = { finePointer: true, hover: true, reducedMotion: false, width: 1440 };
  assert.equal(truckAnimationEnabled(normal), true);
  for (const patch of [{ finePointer: false }, { hover: false }, { reducedMotion: true }, { width: 1024 }]) assert.equal(truckAnimationEnabled({ ...normal, ...patch }), false);
});
test('Truck motion interpolates without overshoot at both 60Hz and 120Hz', () => {
  const simulate = hz => {
    const engine = createTruckAnimationEngine(() => 0.5);
    engine.move(0, 0, 0); engine.move(200, 80, 0);
    for (let tick = 1; tick <= hz / 5; tick++) { engine.step(tick * 1000 / hz); assert.ok(engine.truck.x <= 200 && engine.truck.y <= 80); }
    return engine.truck;
  };
  const a = simulate(60), b = simulate(120);
  assert.ok(Math.abs(a.x - b.x) < 0.001);
  assert.ok(a.x > 195 && a.y > 78);
});
test('Sprite selects a travel view and remains upright; exhaust stays behind the actual vehicle', () => {
  const engine = createTruckAnimationEngine(() => 0.5);
  engine.move(100, 100, 0); engine.move(500, 200, 16); engine.step(16);
  assert.equal(engine.truck.direction, 1);
  assert.ok(truckRear(engine.truck).x < engine.truck.x);
  engine.move(-400, 400, 32); engine.step(32);
  assert.equal(engine.truck.direction, -1);
  assert.ok(truckRear(engine.truck).x > engine.truck.x);
  assert.ok(Math.abs(engine.truck.angle) <= 4);
  const vertical = truckRear({ x: 50, y: 50, direction: 1, angle: 4 });
  assert.ok(vertical.x < 50 && vertical.y > 50);
});
test('Smoke stops emitting at rest, dissipates and allows the animation loop to sleep', () => {
  const engine = createTruckAnimationEngine(() => 0.5);
  engine.move(0, 0, 0);
  for (let t = 16; t < 320; t += 16) { engine.move(t, 100, t); engine.step(t); }
  const count = () => engine.particles.filter(particle => particle.active).length;
  assert.ok(count() > 0);
  engine.step(420);
  const born = engine.particles.map(particle => particle.born);
  for (let t = 436; t < 1600; t += 16) engine.step(t);
  assert.deepEqual(engine.particles.map(particle => particle.born), born);
  assert.equal(count(), 0);
  assert.equal(engine.step(1700), false);
});
test('A prolonged run reuses a bounded pool and reset clears every particle', () => {
  const engine = createTruckAnimationEngine(() => 0.5);
  const pool = [...engine.particles];
  for (let t = 0; t < 60_000; t += 16) {
    engine.move(600 + Math.sin(t / 250) * 300, 300 + Math.cos(t / 250) * 150, t);
    engine.step(t);
    assert.ok(engine.particles.filter(particle => particle.active).length <= 24);
  }
  assert.equal(engine.particles.length, TRUCK_ANIMATION.maxParticles);
  engine.particles.forEach((particle, index) => assert.equal(particle, pool[index]));
  engine.reset();
  assert.ok(engine.particles.every(particle => !particle.active && particle.opacity === 0));
  assert.equal(engine.step(61_000), false);
});
test('Wheel rotation is driven by travel and settles with the truck instead of spinning at rest', () => {
  const engine = createTruckAnimationEngine(() => 0.5);
  engine.move(100, 100, 0); engine.move(400, 150, 16); engine.step(16);
  assert.ok(engine.truck.wheelAngle > 0);
  assert.ok(Math.abs(engine.truck.bob) <= 0.32);
  for (let t = 32; t < 1800; t += 16) engine.step(t);
  const wheelAngle = engine.truck.wheelAngle;
  engine.step(2000);
  assert.ok(Math.abs(engine.truck.wheelAngle - wheelAngle) < 0.001);
  assert.ok(Math.abs(engine.truck.bob) < 0.01);
});
test('Exhaust remains visible at moderate speed and fills a fast motion gap without growing the pool', () => {
  const engine = createTruckAnimationEngine(() => 0.5);
  engine.move(100, 100, 0);
  for (let t = 16; t <= 160; t += 16) { engine.move(100 + t * 0.3, 100, t); engine.step(t); }
  assert.ok(engine.particles.some(particle => particle.active && particle.opacity > 0.3));
  engine.move(450, 100, 176); engine.step(176);
  engine.move(650, 100, 208); engine.step(208);
  assert.ok(engine.particles.filter(particle => particle.born === 208).length >= 2);
  assert.ok(engine.particles.filter(particle => particle.active).length <= 24);
});
