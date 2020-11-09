import { TestBed } from '@angular/core/testing';
import { CurrencyStoreModule } from './currency-store.module';

describe('CurrencyStoreModule', () => {
  let module: CurrencyStoreModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyStoreModule]
    });

    module = TestBed.inject(CurrencyStoreModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
