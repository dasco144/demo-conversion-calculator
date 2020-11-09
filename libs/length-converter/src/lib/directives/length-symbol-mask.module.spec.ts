import { TestBed } from '@angular/core/testing';
import { LengthSymbolMaskModule } from './length-symbol-mask.module';

describe('LengthUnitMaskModule', () => {
  let module: LengthSymbolMaskModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LengthSymbolMaskModule]
    });

    module = TestBed.inject(LengthSymbolMaskModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
