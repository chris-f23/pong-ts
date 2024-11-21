export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  isPaused: boolean = false;

  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(params: { appElement: HTMLElement }) {
    this.canvas = document.createElement("canvas");

    this.canvas.style.border = "1px solid magenta";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    this.canvas.width = 600;
    this.canvas.height = 400;
    this.ctx = this.canvas.getContext("2d")!;

    this.canvas.onmousemove = (e) => {
      var rect = this.canvas.getBoundingClientRect();
      this.mousePosition.x = e.clientX - rect.left;
      this.mousePosition.y = e.clientY - rect.top;
    };

    params.appElement.appendChild(this.canvas);
  }

  onMouseMove() {}
}
