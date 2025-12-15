import { idx } from "./temperatureField";

const MAX_SPEED = 1.5;
const NEIGHBOR_RADIUS = 10;
const SEP_WEIGHT = 1.2;
const ALIGN_WEIGHT = 1.0;
const COH_WEIGHT = 0.8;

function temperatureGradient(field, x, y) {
  const w = field.width;
  const h = field.height;

  const xm = Math.max(0, x - 1);
  const xp = Math.min(w - 1, x + 1);
  const ym = Math.max(0, y - 1);
  const yp = Math.min(h - 1, y + 1);

  const dx =
    field.data[idx(xp, y, w)] -
    field.data[idx(xm, y, w)];

  const dy =
    field.data[idx(x, yp, w)] -
    field.data[idx(x, ym, w)];

  return { x: dx, y: dy };
}


export function createRobots(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    pos: { x: Math.random()*80-40, y: Math.random()*80-40 },
    vel: { x: Math.random()-0.5, y: Math.random()-0.5 },
    temperature: 20,
    history: []
  }));
}

function limit(v) {
  const m = Math.hypot(v.x, v.y);
  if (m > MAX_SPEED) {
    v.x = v.x / m * MAX_SPEED;
    v.y = v.y / m * MAX_SPEED;
  }
}

export function updateRobots(robots, temperatureField, { recording, dt, currentTime, speed, boids }) {
  return robots.map(r => {
    let sep = {x:0,y:0}, ali={x:0,y:0}, coh={x:0,y:0}, count=0;
    robots.forEach(o => {
      const dx=r.pos.x-o.pos.x, dy=r.pos.y-o.pos.y;
      const d=Math.hypot(dx,dy);
      if (o!==r && d<NEIGHBOR_RADIUS) {
        sep.x+=dx/(d||1); sep.y+=dy/(d||1);
        ali.x+=o.vel.x; ali.y+=o.vel.y;
        coh.x+=o.pos.x; coh.y+=o.pos.y;
        count++;
      }
    });
    if(count){
      ali.x/=count; ali.y/=count;
      coh.x=(coh.x/count-r.pos.x); coh.y=(coh.y/count-r.pos.y);
    }
    const gx = Math.round((r.pos.x + 50));
    const gy = Math.round((r.pos.y + 50));
    const heat = temperatureGradient(temperatureField, gx, gy);
    r.vel.x += boids.sep*sep.x + boids.ali*ali.x +
               boids.coh*coh.x + boids.heat*heat.x;
    r.vel.y += boids.sep*sep.y + boids.ali*ali.y +
               boids.coh*coh.y + boids.heat*heat.y;
    limit(r.vel);

    r.pos.x += r.vel.x * speed * dt;
    r.pos.y += r.vel.y * speed * dt;

    if (Math.abs(r.pos.x)>40) r.vel.x*=-1;
    if (Math.abs(r.pos.y)>40) r.vel.y*=-1;
    if (Math.abs(r.pos.x)<0) r.vel.x*=-1;
    if (Math.abs(r.pos.y)<0) r.vel.y*=-1;

    r.temperature = temperatureField.data[idx(gx, gy, temperatureField.width)];
    if (recording)
      r.history.push({t:currentTime,temp:r.temperature});

    return {...r};
  });
}
