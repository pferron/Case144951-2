import type { KeyValueCache, KeyValueCacheSetOptions } from 'apollo-server-caching';

export class MapKeyValueCache<V> implements KeyValueCache<V> {
  store = new Map<string, V>();

  public async get(key: string): Promise<V> {
    return this.store.get(key);
  }

  public async set(key: string, value: V, _?: KeyValueCacheSetOptions): Promise<void> {
    this.store.set(key, value);
  }

  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  public get size(): number {
    return this.store.size;
  }
}
