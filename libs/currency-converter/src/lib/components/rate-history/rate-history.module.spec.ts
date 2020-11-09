import { TestBed } from '@angular/core/testing';
import { RateHistoryModule } from './rate-history.module';

describe('RateHistoryModule', () => {
  let module: RateHistoryModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RateHistoryModule]
    });

    module = TestBed.inject(RateHistoryModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
