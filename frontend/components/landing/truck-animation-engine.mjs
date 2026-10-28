export const TRUCK_ANIMATION = Object.freeze({ width: 72, height: 63, maxParticles: 24, followMs: 42, turnMs: 75, maxTilt: 4, maxTrail: 104 });
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const radians = Math.PI / 180;
const wrap = angle => Math.atan2(Math.sin(angle), Math.cos(angle));
export const TRUCK_VIEWS = Object.freeze({
  e: { angle: 0, column: 0, row: 0 }, ne: { angle: -45, column: 1, row: 0 },
  n: { angle: -90, column: 2, row: 0 }, nw: { angle: -135, column: 3, row: 0 },
  w: { angle: 180, column: 0, row: 1 }, sw: { angle: 135, column: 1, row: 1 },
  s: { angle: 90, column: 2, row: 1 }, se: { angle: 45, column: 3, row: 1 },
});
const clockwise = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'];

export function truckAnimationEnabled({ finePointer, hover, reducedMotion, width }) {
  return finePointer && hover && !reducedMotion && width >= 1025;
}

/** Hysteresis avoids alternating sprites when travel is near a sector boundary. */
export function truckView(vx, vy, current = 'e') {
  if (Math.hypot(vx, vy) < 2) return current;
  const angle = Math.atan2(vy, vx);
  if (Math.abs(wrap(angle - TRUCK_VIEWS[current].angle * radians)) < 31 * radians) return current;
  const sector = (Math.round(angle / (Math.PI / 4)) + 8) % 8;
  return clockwise[sector];
}

/** Rear follows the selected side/top/front view, not a horizontally flipped image. */
export function truckRear({ x, y, direction = 1, view, angle = 0, bob = 0 }) {
  const selected = view || (direction < 0 ? 'w' : 'e');
  const heading = (TRUCK_VIEWS[selected].angle + angle) * radians;
  const side = selected === 'e' || selected === 'w';
  return { x: x - Math.cos(heading) * 24, y: y + bob - Math.sin(heading) * 24 + (side ? 9 : 0) };
}

/** Bounded visual simulation, independent of React, DOM, auth or business state. */
export function createTruckAnimationEngine(random = Math.random) {
  const particles = Array.from({ length: TRUCK_ANIMATION.maxParticles }, () => ({ active: false, x: 0, y: 0, opacity: 0, scale: 0 }));
  const truck = { x: 0, y: 0, direction: 1, view: 'e', angle: 0, bob: 0, wheelAngle: 0 };
  let travelled = 0, target = { x: 0, y: 0 }, previous = null, lastTarget = -Infinity, lastEmission = -Infinity, started = false;
  function move(x, y, now) {
    target = { x, y }; lastTarget = now;
    if (!started) { Object.assign(truck, { x, y, angle: 0, bob: 0, wheelAngle: 0 }); travelled = 0; started = true; previous = now; }
  }
  function reset() {
    started = false; previous = null; lastTarget = lastEmission = -Infinity;
    truck.angle = 0; truck.bob = 0; truck.wheelAngle = 0; travelled = 0;
    for (const particle of particles) { particle.active = false; particle.opacity = 0; }
  }
  function step(now) {
    if (!started) return false;
    const dt = clamp(now - previous, 0, 32); previous = now;
    const oldX = truck.x, oldY = truck.y, previousRear = truckRear(truck), previousView = truck.view;
    const follow = 1 - Math.exp(-dt / TRUCK_ANIMATION.followMs);
    truck.x += (target.x - truck.x) * follow; truck.y += (target.y - truck.y) * follow;
    const vx = dt ? (truck.x - oldX) * 1000 / dt : 0, vy = dt ? (truck.y - oldY) * 1000 / dt : 0;
    const distance = Math.hypot(truck.x - oldX, truck.y - oldY), speed = Math.hypot(vx, vy);
    const moving = speed > 35 && now - lastTarget < 90;
    travelled += distance; truck.wheelAngle = (travelled * 360 / 26) % 360;
    truck.bob = speed > 8 ? Math.sin(travelled * 0.45) * 0.32 * Math.min(speed / 400, 1) : truck.bob * Math.exp(-dt / 55);
    if (speed > 2 && now - lastTarget < 90) truck.view = truckView(vx, vy, truck.view);
    if (Math.abs(vx) > 35) truck.direction = vx < 0 ? -1 : 1;
    const relative = wrap(Math.atan2(vy, vx) - TRUCK_VIEWS[truck.view].angle * radians) / radians;
    const tilt = moving ? clamp(relative * 0.1, -TRUCK_ANIMATION.maxTilt, TRUCK_ANIMATION.maxTilt) : 0;
    truck.angle += (tilt - truck.angle) * (1 - Math.exp(-dt / TRUCK_ANIMATION.turnMs));
    const rear = truckRear(truck);
    if (moving && now - lastEmission >= clamp(65 - speed * 0.03, 24, 62)) {
      const count = Math.min(3, Math.max(1, Math.ceil(distance / 18)));
      for (let index = 0; index < count; index++) {
        const particle = particles.find(item => !item.active); if (!particle) break;
        const blend = previousView !== truck.view ? 1 : (index + 1) / count;
        const heading = (TRUCK_VIEWS[truck.view].angle + truck.angle) * radians;
        Object.assign(particle, {
          active: true, born: now, life: 560 + random() * 220,
          startX: previousRear.x + (rear.x - previousRear.x) * blend,
          startY: previousRear.y + (rear.y - previousRear.y) * blend,
          dx: -Math.cos(heading) * (10 + random() * 7), dy: -Math.sin(heading) * 7 - 10 - random() * 7,
          opacity: 0.38, scale: 0.65,
        });
      }
      lastEmission = now;
    }
    let alive = false;
    for (const particle of particles) {
      if (!particle.active) continue;
      const age = (now - particle.born) / particle.life;
      particle.x = particle.startX + particle.dx * age; particle.y = particle.startY + particle.dy * age;
      if (age >= 1 || Math.hypot(particle.x - rear.x, particle.y - rear.y) > TRUCK_ANIMATION.maxTrail) {
        particle.active = false; particle.opacity = 0; continue;
      }
      particle.opacity = 0.38 * (1 - age) ** 1.35; particle.scale = 0.65 + age * 1.15; alive = true;
    }
    return alive || Math.hypot(target.x - truck.x, target.y - truck.y) > 0.08 || Math.abs(truck.angle) > 0.02 || Math.abs(truck.bob) > 0.01;
  }
  return { truck, particles, move, step, reset };
}
