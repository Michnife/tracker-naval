import { TestBed } from '@angular/core/testing';

import { Navire } from './navire';

describe('Navire', () => {
  let service: Navire;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Navire);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
