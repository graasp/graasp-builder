export default class CaseInsensitiveSet {
  // Because we won't have a huge set, we can duplicate it to optimize the search
  private readonly originalSet: Set<string>;

  private readonly loweredSet: Set<string>;

  constructor(initValues?: string[]) {
    this.originalSet = new Set<string>(initValues ?? []);
    this.loweredSet = new Set<string>(
      initValues?.map((e) => e.toLocaleLowerCase()) ?? [],
    );
  }

  public has(value: string): boolean {
    return this.loweredSet.has(value.toLowerCase());
  }

  public add(value: string): void {
    if (!this.has(value)) {
      this.originalSet.add(value);
      this.loweredSet.add(value.toLowerCase());
    }
  }

  public delete(value: string): void {
    this.originalSet.delete(value);
    this.loweredSet.delete(value.toLowerCase());
  }

  public values(): string[] {
    return Array.from(this.originalSet);
  }

  public size(): number {
    return this.originalSet.size;
  }

  public copy(newValues: string[] = []): CaseInsensitiveSet {
    return new CaseInsensitiveSet([...this.values(), ...newValues]);
  }

  public isEqual(other: CaseInsensitiveSet): boolean {
    if (this.size() !== other.size()) {
      return false;
    }

    return this.values().every((e) => other.has(e));
  }
}
