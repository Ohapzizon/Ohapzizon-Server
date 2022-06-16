import { ConstructorType } from './types/constructor.type';

export class Builder<T> {
  public object: T;

  constructor(ctor: ConstructorType<T>) {
    this.object = new ctor();
  }

  build(): T {
    return this.object;
  }
}
