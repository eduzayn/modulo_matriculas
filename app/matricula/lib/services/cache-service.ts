// Simplified cache service
import NodeCache from 'node-cache';

// Create a cache instance with standard TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export const cacheService = {
  /**
   * Get a value from cache
   */
  get: <T>(key: string): T | undefined => {
    return cache.get<T>(key);
  },

  /**
   * Set a value in cache
   */
  set: <T>(key: string, value: T, ttl?: number): boolean => {
    return cache.set(key, value, ttl);
  },

  /**
   * Delete a value from cache
   */
  delete: (key: string): number => {
    return cache.del(key);
  },

  /**
   * Clear all cache
   */
  clear: (): void => {
    cache.flushAll();
  },

  /**
   * Get cache stats
   */
  getStats: () => {
    return cache.getStats();
  }
};
