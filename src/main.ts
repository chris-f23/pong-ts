import "./style.css";
import { InputController } from "./lib/InputController";
import { Game } from "./lib/Game";
import { Paddle } from "./lib/Paddle";
import { Background } from "./lib/Background";
import { LazyImage } from "./lib/ImageLoader";
import { Ball } from "./lib/Ball";

const game = new Game({
  appElement: document.getElementById("app")!,
});

// Imagenes.
const bgImage = new LazyImage("/bg-grid.png");
const bluePaddleImage = new LazyImage(`/paddle-blue.png`);
const pinkPaddleImage = new LazyImage(`/paddle-pink.png`);
const ballImage = new LazyImage(`/ball.png`);

// Objetos.
const background = new Background({
  game,
  lazyImage: bgImage,
});

const leftPaddle = new Paddle({
  game,
  side: "left",
  playerName: "blue",
  lazyImage: bluePaddleImage,
});

const rightPaddle = new Paddle({
  game,
  side: "right",
  playerName: "pink",
  lazyImage: pinkPaddleImage,
});

const ball = new Ball({
  game,
  lazyImage: ballImage,
});

enum GAME_STATE {
  READY,
  PLAYING,
}
enum PLAYER_TURN {
  LEFT_PLAYER,
  RIGHT_PLAYER,
}
let currentPlayerTurn: PLAYER_TURN = PLAYER_TURN.LEFT_PLAYER;

let gameState: GAME_STATE = GAME_STATE.READY;

let pauseCooldown = 0;

function checkPause() {
  if (pauseCooldown > 0) {
    pauseCooldown--;
    return;
  }

  if (InputController.isKeyDown("KeyP")) {
    game.isPaused = !game.isPaused;
    pauseCooldown = 10;
  }
}

// Game loop.
function gameLoop() {
  checkPause();

  if (game.isPaused === false) {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    if (gameState === GAME_STATE.READY) {
      if (currentPlayerTurn === PLAYER_TURN.LEFT_PLAYER) {
        ball.setPosition({ x: leftPaddle.x + 20, y: leftPaddle.y });

        if (InputController.isKeyDown("Space")) {
          ball.shoot(leftPaddle);
          gameState = GAME_STATE.PLAYING;
        }
      } else {
        ball.setPosition({ x: rightPaddle.x - 20, y: rightPaddle.y });

        if (Math.random() * 100 > 99) {
          ball.shoot(rightPaddle);
          gameState = GAME_STATE.PLAYING;
        }
      }
    } else {
      // Detectar colisiones (izq / der).
      if (ball.x < game.canvas.width / 2) {
        ball.checkCollision(leftPaddle);
      } else if (ball.x > game.canvas.width / 2) {
        ball.checkCollision(rightPaddle);
      }

      if (ball.isVisible() === false) {
        if (currentPlayerTurn === PLAYER_TURN.LEFT_PLAYER) {
          currentPlayerTurn = PLAYER_TURN.RIGHT_PLAYER;
        } else {
          currentPlayerTurn = PLAYER_TURN.LEFT_PLAYER;
        }
        ball.stop();
        gameState = GAME_STATE.READY;
      }
    }

    background.update();
    leftPaddle.update(ball);
    rightPaddle.update(ball);
    ball.update();
  } else {
    // ball.x = game.mousePosition.x;
    // ball.y = game.mousePosition.y;

    game.ctx.font = "50px consolas";
    game.ctx.textAlign = "center";
    game.ctx.textBaseline = "middle";
    game.ctx.fillStyle = "white";
    game.ctx.fillText("PAUSE", game.canvas.width / 2, game.canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Carga de imagenes.
const images = [bgImage, bluePaddleImage, pinkPaddleImage, ballImage];

(async () => {
  for (const image of images) {
    await image.load();
  }
})();

// @ts-ignore
document["game"] = {
  ball,
};
