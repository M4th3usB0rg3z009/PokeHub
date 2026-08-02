interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private readonly store = new Map<string, CacheItem<unknown>>();

  set<T>(
    key: string,
    value: T,
    durationInMilliseconds: number,
  ): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + durationInMilliseconds,
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new MemoryCache();