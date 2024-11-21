import { LazyImage } from "./ImageLoader";

export class Sprite {
  constructor(
    private lazyImage: LazyImage,
    private ctx: CanvasRenderingContext2D
  ) {}

  draw(x: number, y: number, width?: number, height?: number) {
    if (!this.lazyImage.img) {
      return;
    }

    this.ctx.drawImage(
      this.lazyImage.img,
      x,
      y,
      width ?? this.lazyImage.img.width,
      height ?? this.lazyImage.img.height
    );
  }
}
