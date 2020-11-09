import { TestBed } from '@angular/core/testing';
import { CurrencyConverterModule } from './currency-converter.module';

describe('CurrencyConverterModule', () => {
  let module: CurrencyConverterModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyConverterModule]
    });

    module = TestBed.inject(CurrencyConverterModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
