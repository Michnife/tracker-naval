import { TestBed } from '@angular/core/testing';

import { Groupe } from './groupe';

describe('Groupe', () => {
  let service: Groupe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Groupe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
