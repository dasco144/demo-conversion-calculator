import { TestBed } from '@angular/core/testing';
import { CurrencySymbolMaskModule } from './currency-symbol-mask.module';

describe('CurrencyMaskModule', () => {
  let module: CurrencySymbolMaskModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencySymbolMaskModule]
    });

    module = TestBed.inject(CurrencySymbolMaskModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
