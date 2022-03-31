import { LoggingInterceptor } from './exception.interceptor';

describe('LoggingInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggingInterceptor()).toBeDefined();
  });
});
