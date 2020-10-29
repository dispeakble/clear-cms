import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import cacheManager from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: cacheManager,
  ) {}

  async get(key): Promise<string> {
    return await this.cache.get(key);
  }

  async getMany(keys: string[]): Promise<string[]> {
    return await this.cache.mget(keys);
  }

  async set(key, value) {
    await this.cache.set(key, value);
  }
}
