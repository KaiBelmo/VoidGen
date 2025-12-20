export class Store<T = any> {
  private state!: T;
  get() {
    if (this.state === null) {
      throw new Error('Store is not initialized!');
    }
    return this.state;
  }

  set(newState: T) {
    this.state = newState;
  }
}
