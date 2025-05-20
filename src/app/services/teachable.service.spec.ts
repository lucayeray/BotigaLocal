import { TestBed } from '@angular/core/testing';

import { TeachableService } from './teachable.service';

describe('TeachableService', () => {
  let service: TeachableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
