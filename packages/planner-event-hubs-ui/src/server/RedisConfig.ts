import { RedisOptions } from 'ioredis';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { validateAndGetEnvironmentVariables } from '@cvent/nextjs/utils/validateAndGetEnvironmentVariables';

export const LOG = LoggerFactory.create('RedisConfig');

export class RedisConfig {
  public static init(noDelay = false): RedisOptions {
    const connectTimeout = 10000;
    const commandTimeout = 1000;
    if (process.env.DEV_MODE === 'true') {
      LOG.debug('Using redis@127.0.0.1 because process.env.NODE_ENV is', process.env.NODE_ENV);
      return { host: '127.0.0.1', port: 6379, connectTimeout, commandTimeout, noDelay };
    }
    const [primaryEndpoint, primaryPort, password] = validateAndGetEnvironmentVariables(
      'ELASTICACHE_PRIMARY_ENDPOINT',
      'ELASTICACHE_PORT',
      'ELASTICACHE_PASSWORD'
    );
    LOG.debug(
      `Using redis@${primaryEndpoint}:${primaryPort} because process.env.(NODE_ENV|NX_MODE) are:`,
      process.env.NODE_ENV,
      process.env.NX_MODE
    );
    return {
      host: primaryEndpoint,
      port: Number(primaryPort),
      username: 'redis-app-user',
      password,
      connectTimeout,
      commandTimeout,
      noDelay,
      tls: {}
    };
  }
}
