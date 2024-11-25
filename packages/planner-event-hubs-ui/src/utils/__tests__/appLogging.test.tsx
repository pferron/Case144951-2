import { initializeClientLogging } from '@utils/appLogging';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

describe('App logging test', () => {
  it('should call set Logging client', () => {
    initializeClientLogging();
    expect(LoggerFactory.create).toHaveBeenCalled();
  });
});
