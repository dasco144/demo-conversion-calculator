import { TestBed } from '@angular/core/testing';
import { CurrencyConverterFeatureModule } from './currency-converter-feature.module';

describe('CurrencyConverterFeatureModule', () => {
  let module: CurrencyConverterFeatureModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyConverterFeatureModule]
    });

    module = TestBed.inject(CurrencyConverterFeatureModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
