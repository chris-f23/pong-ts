export type Img = HTMLImageElement;

export class LazyImage {
  #promise: Promise<Img>;
  #cache: Img | undefined = undefined;

  public get img(): Img | undefined {
    return this.#cache;
  }

  constructor(src: string) {
    this.#promise = new Promise<Img>((resolve) => {
      const imageElement = document.createElement("img");
      imageElement.src = src;
      imageElement.onload = () => {
        console.log(`Loaded '${src}'.`);
        resolve(imageElement);
      };
    });
  }

  async load() {
    if (this.#cache === undefined) {
      this.#cache = await this.#promise;
    }
  }
}
