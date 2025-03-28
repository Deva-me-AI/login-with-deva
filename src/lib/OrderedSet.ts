export class OrderedSet<T> {
  private _map: Map<T, boolean>;

  constructor(iterable?: Iterable<T>) {
    this._map = new Map<T, boolean>();

    // If an iterable is provided, add each element
    if (iterable) {
      for (const item of iterable) {
        this._map.set(item, true);
      }
    }
  }

  // Add an item to the set - returns a new instance
  add(value: T): OrderedSet<T> {
    const newSet = new OrderedSet<T>(this);

    // If the value doesn't exist, add it to the map
    if (!newSet._map.has(value)) {
      newSet._map.set(value, true);
    }

    return newSet;
  }

  // Add multiple values to a set
  addAll(values: T[]): OrderedSet<T> {
    let newSet = new OrderedSet<T>(this);

    for (const value of values) {
      newSet = newSet.add(value);
    }

    return newSet;
  }

  // Find and replace a value based on a predicate
  updateWhere<T>(
    set: OrderedSet<T>,
    predicate: (value: T) => boolean,
    updater: (value: T) => T,
  ): OrderedSet<T> {
    let result = new OrderedSet<T>();

    for (const value of set) {
      if (predicate(value)) {
        result = result.add(updater(value));
      } else {
        result = result.add(value);
      }
    }

    return result;
  }

  // Insert an element at the beginning of the set - returns a new instance
  prepend(value: T): OrderedSet<T> {
    const newSet = new OrderedSet<T>();

    // Add the new value first
    newSet._map.set(value, true);

    // Add all existing elements except the value (to maintain uniqueness)
    for (const [key, val] of this._map) {
      if (key !== value) {
        newSet._map.set(key, val);
      }
    }

    return newSet;
  }

  // Delete an item from the set - returns a new instance
  delete(value: T): OrderedSet<T> {
    const newSet = new OrderedSet<T>();

    // Copy all elements except the one to delete
    for (const [key, val] of this._map) {
      if (key !== value) {
        newSet._map.set(key, val);
      }
    }

    return newSet;
  }

  // Check if deletion was successful
  hasDeleted(value: T): boolean {
    return this._map.has(value);
  }

  // Check if an item exists in the set
  has(value: T): boolean {
    return this._map.has(value);
  }

  // Get the size of the set
  get size(): number {
    return this._map.size;
  }

  clear(): OrderedSet<T> {
    return new OrderedSet<T>();
  }

  // Return an iterator for the set's values
  [Symbol.iterator](): Iterator<T> {
    return this._map.keys();
  }

  // Get all values in the order of insertion
  values(): T[] {
    return [...this._map.keys()];
  }

  // Get the first item in the set
  first(): T | undefined {
    const iterator = this._map.keys();
    return iterator.next().value;
  }

  // Get the last item in the set
  last(): T | undefined {
    const values = this.values();
    return values[values.length - 1];
  }

  // Convert the set to an array
  toArray(): T[] {
    return this.values();
  }

  // Perform set operations
  union(otherSet: OrderedSet<T>): OrderedSet<T> {
    let newSet = new OrderedSet<T>(this);
    for (const item of otherSet) {
      if (!newSet.has(item)) {
        newSet = newSet.add(item);
      }
    }
    return newSet;
  }

  intersection(otherSet: OrderedSet<T>): OrderedSet<T> {
    let newSet = new OrderedSet<T>();
    for (const item of this) {
      if (otherSet.has(item)) {
        newSet = newSet.add(item);
      }
    }
    return newSet;
  }

  difference(otherSet: OrderedSet<T>): OrderedSet<T> {
    let newSet = new OrderedSet<T>();
    for (const item of this) {
      if (!otherSet.has(item)) {
        newSet = newSet.add(item);
      }
    }
    return newSet;
  }

  // Custom toString method for easy logging
  toString(): string {
    return `OrderedSet(${this.values().join(", ")})`;
  }
}
