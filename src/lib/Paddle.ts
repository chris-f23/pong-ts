import { Ball } from "./Ball";
import { Game } from "./Game";
import { LazyImage } from "./ImageLoader";
import { InputController } from "./InputController";
import { Sprite } from "./Sprite";
import { randomInt, randomFloat } from "./Utils";

const sideOffset = 50;
const verticalLimit = 40;
export const PADDLE_MAX_SPEED = 16;

export class Paddle {
  playerName: string;
  game: Game;
  sprite: Sprite;
  side: "left" | "right";
  x: number;
  y: number;
  #initialX: number;
  #initialY: number;
  width: number = 20;
  height: number = 80;

  speed: number;

  constructor({ game, playerName, lazyImage, side }: PaddleConstructorParams) {
    this.game = game;
    this.playerName = playerName;
    this.sprite = new Sprite(lazyImage, game.ctx);
    this.side = side;

    this.speed = 0;

    this.#initialX =
      this.side === "left"
        ? sideOffset + this.width / 2
        : this.game.canvas.width - sideOffset - this.width / 2;
    this.#initialY = this.game.ctx.canvas.height / 2;

    this.x = this.#initialX;
    this.y = this.#initialY;
  }

  resetPosition() {
    this.x = this.#initialX;
    this.y = this.#initialY;
  }

  update(ball: Ball) {
    this.sprite.draw(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    if (this.side === "left") {
      if (InputController.isKeyDown("ArrowDown")) {
        this.speed += 1;
      } else if (InputController.isKeyDown("ArrowUp")) {
        this.speed -= 1;
      } else {
        this.speed *= 0.8;
      }
    } else {
      if (ball.y > this.y && randomInt(0, 10) > 1) {
        this.speed += 1;
      } else if (ball.y < this.y && randomInt(0, 10) > 1) {
        this.speed -= 1;
      } else {
        this.speed *= 0.9;
      }
      // if (utils.randomInt(0, 10) > 7) {
      //   this.speed += utils.randomFloat(-1, 1);
      // }
      if (randomInt(0, 10) > 7) {
        this.speed *= randomFloat(0.6, 0.9);
      }
    }

    this.y += this.speed;

    // Mantener la velocidad dentro de los limites
    const absSpeed = Math.abs(this.speed);
    if (absSpeed > PADDLE_MAX_SPEED) {
      this.speed = PADDLE_MAX_SPEED * Math.sign(this.speed);
    } else if (absSpeed > 0 && absSpeed < 1) {
      this.speed = 0;
    }

    // Evitar que salga del area de juego.
    const upperLimit =
      this.game.canvas.height - verticalLimit - this.height / 2;
    const lowerLimit = verticalLimit + this.height / 2;

    if (this.y > upperLimit) {
      this.y = upperLimit;
    } else if (this.y < lowerLimit) {
      this.y = lowerLimit;
    }
  }
}

type PaddleConstructorParams = {
  playerName: string;
  game: Game;
  lazyImage: LazyImage;
  side: "left" | "right";
};
