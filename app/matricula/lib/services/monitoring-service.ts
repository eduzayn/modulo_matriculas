// Simplified monitoring service
import { cacheService } from './cache-service';

interface MetricData {
  count: number;
  lastUpdated: Date;
}

export const monitoringService = {
  /**
   * Increment a metric counter
   */
  incrementMetric: (metricName: string): void => {
    const metricKey = `metric:${metricName}`;
    const currentMetric = cacheService.get<MetricData>(metricKey);
    
    if (currentMetric) {
      cacheService.set(metricKey, {
        count: currentMetric.count + 1,
        lastUpdated: new Date()
      });
    } else {
      cacheService.set(metricKey, {
        count: 1,
        lastUpdated: new Date()
      });
    }
  },
  
  /**
   * Get all metrics
   */
  getAllMetrics: (): Record<string, MetricData> => {
    const metrics: Record<string, MetricData> = {};
    const keys = cacheService.get<string[]>('metric:keys') || [];
    
    keys.forEach(key => {
      const metricData = cacheService.get<MetricData>(key);
      if (metricData) {
        metrics[key.replace('metric:', '')] = metricData;
      }
    });
    
    return metrics;
  },
  
  /**
   * Record API request
   */
  recordApiRequest: (path: string, method: string, statusCode: number, durationMs: number): void => {
    monitoringService.incrementMetric(`api:${method}:${path}`);
    monitoringService.incrementMetric(`status:${statusCode}`);
    
    // Record response time in buckets
    let timeBucket = '0-100ms';
    if (durationMs > 1000) {
      timeBucket = '1000ms+';
    } else if (durationMs > 500) {
      timeBucket = '500-1000ms';
    } else if (durationMs > 100) {
      timeBucket = '100-500ms';
    }
    
    monitoringService.incrementMetric(`response_time:${timeBucket}`);
  }
};
