import { Game } from "./Game";
import { Img, LazyImage } from "./ImageLoader";
import { Sprite } from "./Sprite";

export class Background {
  sprite: Sprite;
  game: Game;

  constructor({ game, lazyImage }: BackgroundConstructorParams) {
    this.game = game;
    this.sprite = new Sprite(lazyImage, game.ctx);
  }

  update() {
    this.sprite.draw(0, 0, this.game.canvas.width, this.game.canvas.height);
  }
}

type BackgroundConstructorParams = {
  game: Game;
  lazyImage: LazyImage;
};
