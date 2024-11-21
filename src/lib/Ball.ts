import { Game } from "./Game";
import { LazyImage } from "./ImageLoader";
import { Paddle, PADDLE_MAX_SPEED } from "./Paddle";
import { Sprite } from "./Sprite";
import { randomBoolean, randomInt } from "./Utils";

const verticalLimit = 40;

const MIN_SPEED_MULTIPLIER = 2;
const MAX_SPEED_MULTIPLIER = 10;

export class Ball {
  game: Game;
  sprite: Sprite;
  x: number;
  y: number;
  diameter: number = 20;
  speedMultiplier: number = MIN_SPEED_MULTIPLIER;

  direction: { x: number; y: number };

  constructor({ game, lazyImage }: BallConstructorParams) {
    this.game = game;
    this.sprite = new Sprite(lazyImage, game.ctx);

    this.x = this.game.canvas.width / 2;
    this.y = this.game.canvas.height / 2;

    this.direction = { x: 0, y: 0 };
  }

  checkCollision(paddle: Paddle) {
    const direction = Math.sign(this.direction.x) === -1 ? "left" : "right";
    const isGoingTowardsPaddle = paddle.side === direction;

    if (!isGoingTowardsPaddle) {
      return;
    }

    const isNearPaddleX =
      Math.abs(this.x - paddle.x) <= this.diameter / 2 + paddle.width / 2;

    if (!isNearPaddleX) {
      return;
    }

    const isNearPaddleY =
      paddle.y - paddle.height / 2 <= this.y &&
      paddle.y + paddle.height / 2 >= this.y;

    if (!isNearPaddleY) {
      return;
    }

    if (Math.abs(paddle.speed) === PADDLE_MAX_SPEED) {
      this.speedMultiplier += 2;
    } else if (paddle.speed !== 0) {
      this.speedMultiplier += 1;
    } else {
      this.speedMultiplier += 0.5;
    }

    const distanceFromCenterOfPaddle = Math.abs(paddle.y - this.y);

    if (distanceFromCenterOfPaddle <= 1.3 && randomBoolean()) {
      this.direction.x *= -1;
      return;
    }

    this.shoot(paddle);
  }

  shoot(paddle: Paddle) {
    const xSign = paddle.side === "left" ? 1 : -1;

    let ySign = 0;
    let angle = Math.PI / randomInt(3, 6);

    if (paddle.speed !== 0) {
      ySign = Math.sign(paddle.speed);
    } else if (this.direction.y !== 0) {
      ySign = Math.sign(this.direction.y);
    }

    if (ySign === 0) {
      ySign = randomInt(0, 1) === 1 ? 1 : -1;
      angle = Math.PI / randomInt(6, 10);
    }

    this.direction.x = xSign * Math.cos(angle);
    this.direction.y = ySign * Math.sin(angle);
  }

  isVisible() {
    if (this.x < 0 || this.x > this.game.canvas.width) {
      return false;
    }
    return true;
  }

  stop() {
    this.speedMultiplier = MIN_SPEED_MULTIPLIER;
    this.direction.x = 0;
    this.direction.y = 0;
  }

  setPosition(newPosition: { x: number; y: number }) {
    this.x = newPosition.x;
    this.y = newPosition.y;
  }

  update() {
    this.sprite.draw(
      this.x - this.diameter / 2,
      this.y - this.diameter / 2,
      this.diameter,
      this.diameter
    );

    if (this.speedMultiplier > MAX_SPEED_MULTIPLIER) {
      this.speedMultiplier = MAX_SPEED_MULTIPLIER;
    } else if (this.speedMultiplier < MIN_SPEED_MULTIPLIER) {
      this.speedMultiplier = MIN_SPEED_MULTIPLIER;
    }

    if (
      this.y <= verticalLimit ||
      this.y >= this.game.canvas.height - verticalLimit
    ) {
      this.direction.y *= -1;
    }

    this.x += this.direction.x * this.speedMultiplier;
    this.y += this.direction.y * this.speedMultiplier;
  }
}

type BallConstructorParams = {
  game: Game;
  lazyImage: LazyImage;
};
