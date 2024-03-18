import P5 from "p5";
import { getNextPosition } from './physics';
import * as Util from './utility';

export type Grain = {
  hue: number,
  falling: boolean,
};

export type MaybeGrain = Grain|null;
export type Matrix<T> = Array<Array<T>>;
export type GrainMatrix = Matrix<MaybeGrain>;
export type GrainPosition = {x: number, y: number, falling: boolean};

let hue = 0;
const hueChangeSpeed = .3;
let granularity = 3;
const fallingSpeed = 12;
const canvasX = Math.min(800, window.innerWidth);
const canvasY = Math.min(800, window.innerHeight);
const grains: GrainMatrix = Array(canvasX).fill(null).map(() => Array(canvasY).fill(null));

const sketch = (p: P5) => {
  p.setup = () => {
    p.createCanvas(canvasX, canvasY);
    p.colorMode("hsl", 255);
    p.frameRate(60);
    
    p.createButton("Save").mousePressed(() => p.saveCanvas("sand", "png"))
  }
  

  p.draw = () => {
    p.clear(0, 0, 0, 1);
    p.background(0);

    if (
      p.mouseIsPressed &&
      Util.isWithinCanvas(p.mouseX, p.mouseY, canvasX, canvasY)
    ) {
      createSand(100, 10);
    }

    for(let x = canvasX - 1; x >= 0; x--) {
      for(let y = canvasY - 1; y >= 0; y--) {
        const grain: MaybeGrain = grains[x][y];

        if (!grain) {
          continue;
        }

        p.stroke(grain.hue, 255, 125);
        p.strokeWeight(granularity)
        p.point(x, y, granularity);
        
        if(grain.falling) {
          const newPosition = getNextPosition(x, y, grains, fallingSpeed, canvasY, granularity, true);
          grains[x][y] = null;
          grains[newPosition.x][newPosition.y] = {...grain, falling: newPosition.falling};
        }
      }
    }
  }

  /**
   * Create some number of grains of sand within a radius of the point of the  mouse click.
   */
  const createSand = (numGrains: number, radius: number): void => {
    hue = Util.incrementHue(hue, hueChangeSpeed);
    const randLocation = (val: number) => Util.randomCallback(
      () => Math.round(val + (Math.random() * radius * granularity)),
      () => Math.round(val - (Math.random() * radius * granularity)),
    );

    for (let i = 0; i <= numGrains; i++) {
      const randMX = Util.clamp(randLocation(p.mouseX), granularity, canvasX - granularity);
      const randMY = Util.clamp(randLocation(p.mouseY), granularity, canvasY - granularity);

      grains[randMX][randMY] = {hue, falling: true};
    }
  }
}

const p5 = new P5(sketch);
