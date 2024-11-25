import { S3ProxyHandler } from '@server/S3ProxyHandler';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { IncomingHttpHeaders } from 'http';
import { S3ProxyCallbackPayload, ScanStatus } from '@cvent/planner-event-hubs-model/types';
import { RedisCache } from '@server/cache/RedisCache';
import { CacheConfig, getS3ProxyCacheKey } from '@server/cache/CacheConfigs';

const LOG = LoggerFactory.create('TempImageHandler');

/**
 * Handle callbacks from s3-proxy for Temp images (entityType agnostic).
 * Stores callback payload in redis so that FE tools (e.g. ImageEditor) can fetch image data (e.g. masterImageUrl).
 *
 * Handles the following payload.status(es)
 *   - SCAN_IN_PROGRESS
 *   - SCAN_SUCCESS
 *   - SCAN_FAILED
 *   - SCAN_ERROR
 *
 * Known possible statuses (see https://wiki.cvent.com/x/Fd0JEg)
 *   - SCAN_IN_PROGRESS
 *   - SCAN_SUCCESS
 *   - SCAN_FAILED
 *   - SCAN_ERROR
 */
export class TempImageHandler extends S3ProxyHandler {
  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  public async handleS3ProxyCallback(
    _headers: IncomingHttpHeaders,
    payload: S3ProxyCallbackPayload,
    // RED
    /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
    clients?: Record<string, any>
  ): Promise<void> {
    this.log('info', 'starting handleS3ProxyCallback', payload);

    if (payload.status === ScanStatus.ScanInProgress) {
      this.log('info', `returning early because ${payload.status}`, payload);
      return;
    }

    const tempImageCache = this.getTempImageCacheClient(clients);
    const s3ProxyCacheConfigs: CacheConfig = getS3ProxyCacheKey(payload.fullFilePath);
    tempImageCache.set(s3ProxyCacheConfigs.key, JSON.stringify(payload), {
      ttl: s3ProxyCacheConfigs.options?.ttl
    });

    this.log('info', 'finished handleS3ProxyCallback', payload);
  }

  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  private getTempImageCacheClient(clients: Record<string, any>): RedisCache {
    // support DI (primarily for testing)
    return clients?.tempImageCache ? clients.tempImageCache : new RedisCache();
  }

  private log(level: string, message: string, payload: S3ProxyCallbackPayload): void {
    LOG[level](`${message} for`, this.centerId, 'Banner', this.entityId, payload);
  }
}
