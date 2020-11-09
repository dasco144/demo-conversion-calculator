import { TestBed } from '@angular/core/testing';
import { LengthConverterFeatureModule } from './length-converter-feature.module';

describe('LengthConverterFeatureModule', () => {
  let module: LengthConverterFeatureModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LengthConverterFeatureModule]
    });

    module = TestBed.inject(LengthConverterFeatureModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
