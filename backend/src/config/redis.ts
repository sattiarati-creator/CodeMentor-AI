import Redis from "ioredis";
import { config } from "./env";
import { logger } from "../utils/logger";

class MemoryCacheFallback {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    let expiresAt: number | undefined;
    if (mode === "EX" && duration) {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }
}

class CacheClient {
  private redis: Redis | null = null;
  private fallback = new MemoryCacheFallback();
  private isRedisAvailable = false;

  constructor() {
    this.initRedis();
  }

  private initRedis() {
    if (process.env.NODE_ENV === "test") {
      this.isRedisAvailable = false;
      return;
    }
    try {
      this.redis = new Redis(config.redisUrl, {
        lazyConnect: true,
        connectTimeout: 500,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Do not spam reconnects if offline in local dev
        reconnectOnError: () => false
      });

      this.redis.connect()
        .then(() => {
          this.isRedisAvailable = true;
          logger.info(" Connected to Redis cache service");
        })
        .catch((err) => {
          this.isRedisAvailable = false;
          logger.info(" Redis not running locally; using fast in-memory cache fallback");
        });

      this.redis.on("error", () => {
        this.isRedisAvailable = false;
      });
    } catch {
      this.isRedisAvailable = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isRedisAvailable && this.redis) {
      try {
        return await this.redis.get(key);
      } catch {
        this.isRedisAvailable = false;
      }
    }
    return this.fallback.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        if (ttlSeconds) {
          await this.redis.set(key, value, "EX", ttlSeconds);
        } else {
          await this.redis.set(key, value);
        }
        return;
      } catch {
        this.isRedisAvailable = false;
      }
    }
    await this.fallback.set(key, value, ttlSeconds ? "EX" : undefined, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    if (this.isRedisAvailable && this.redis) {
      try {
        await this.redis.del(key);
        return;
      } catch {
        this.isRedisAvailable = false;
      }
    }
    await this.fallback.del(key);
  }
}

export const cache = new CacheClient();
