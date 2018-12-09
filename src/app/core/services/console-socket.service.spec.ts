import { TestBed } from '@angular/core/testing';

import { ConsoleSocketService } from './console-socket.service';

describe('ConsoleSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsoleSocketService = TestBed.get(ConsoleSocketService);
    expect(service).toBeTruthy();
  });
});
