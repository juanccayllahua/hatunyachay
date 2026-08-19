import { TestBed } from '@angular/core/testing';

import { LugarServices } from './lugar-services';

describe('LugarServices', () => {
  let service: LugarServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LugarServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
