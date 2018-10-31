import { TestBed } from '@angular/core/testing';

import { ReactiveComponentLoaderService } from './reactive-component-loader.service';

describe('ReactiveComponentLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReactiveComponentLoaderService = TestBed.get(ReactiveComponentLoaderService);
    expect(service).toBeTruthy();
  });
});
