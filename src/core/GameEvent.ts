type Listener<T> = (arg: T) => void;

export class GameEvent<T> {
  eventName: string;
  private listeners: Listener<T>[] = [];

  constructor(name: string) {
    this.eventName = name;
  }

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
  }
  unsubscribe(listener: Listener<T>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  unsubscribeAll() {
    this.listeners = [];
  }
  emit(arg: T) {
    this.listeners.forEach((listener) => listener(arg));
  }
}
