import { TestBed } from '@angular/core/testing';

import { DogGuard } from './dog.guard';

describe('DogGuard', () => {
  let guard: DogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
