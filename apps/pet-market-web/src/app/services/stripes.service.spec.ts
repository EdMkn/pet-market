import { TestBed } from '@angular/core/testing';

import { StripesService } from './stripes.service';

describe('StripesService', () => {
  let service: StripesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
