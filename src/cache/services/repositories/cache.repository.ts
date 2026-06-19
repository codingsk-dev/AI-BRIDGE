export class CacheRepository {
  async set(...args: any[]) { return null as any; }
  async get(...args: any[]) { return null as any; }
  async del(...args: any[]) { return null as any; }
  async exists(...args: any[]) { return null as any; }
  async incr(...args: any[]) { return null as any; }
  async decr(...args: any[]) { return null as any; }
  async sadd(...args: any[]) { return null as any; }
  async smembers(...args: any[]) { return null as any; }
  async lpush(...args: any[]) { return null as any; }
  async lrange(...args: any[]) { return null as any; }
  async info(...args: any[]) { return null as any; }
  async flushall(...args: any[]) { return null as any; }
  async ttl(...args: any[]) { return null as any; }

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const cacheRepository = new CacheRepository();
