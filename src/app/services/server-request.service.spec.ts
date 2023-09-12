import { TestBed } from '@angular/core/testing';

import { ServerRequestService } from './server-request.service';

describe('ServerRequestService', () => {
  let service: ServerRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
