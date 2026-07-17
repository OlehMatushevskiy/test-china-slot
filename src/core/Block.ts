export abstract class Block {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract start(): void | Promise<void>;

  resize(): void {}

  end(): void {}
}
