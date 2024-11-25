import { Feature } from '@cvent/planner-event-hubs-model/types';
import { isFeatureEnabled, reducePlannerFeatures } from '../featureUtil';

describe('feature util', () => {
  it('should determine that a feature is enabled', () => {
    const features: Record<string, boolean> = { video: true };
    expect(isFeatureEnabled(features, 'video')).toEqual(true);
  });

  it('should determine that a feature is not enabled', () => {
    const features: Record<string, boolean> = { noVideo: false };
    expect(isFeatureEnabled(features, 'noVideo')).toEqual(false);
  });

  it('should assume that a feature is not enabled when it is not present', () => {
    const features: Record<string, boolean> = { video: true };
    expect(isFeatureEnabled(features, 'event')).toEqual(false);
  });

  it('should convert to record object from array', () => {
    const features: Feature[] = [{ code: 'video', enabled: true }];
    expect(reducePlannerFeatures(features).video).toEqual(true);
  });
});
