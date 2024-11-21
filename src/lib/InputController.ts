export class InputController {
  private static instance: InputController = new InputController();

  private readonly dictionary: Record<string, boolean> = {};

  private constructor() {
    document.onkeydown = (e) => {
      this.dictionary[e.code] = true;
    };
    document.onkeyup = (e) => {
      this.dictionary[e.code] = false;
    };
  }

  static isKeyUp(key: string) {
    return InputController.instance.dictionary[key] === false;
  }
  static isKeyDown(key: string) {
    return InputController.instance.dictionary[key] === true;
  }
}
