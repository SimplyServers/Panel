import { TestBed } from '@angular/core/testing';

import { SSAnalyticsService } from './ssanalytics.service';

describe('SSAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SSAnalyticsService = TestBed.get(SSAnalyticsService);
    expect(service).toBeTruthy();
  });
});
