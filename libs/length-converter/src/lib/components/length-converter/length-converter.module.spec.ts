import { TestBed } from '@angular/core/testing';
import { LengthConverterModule } from './length-converter.module';

describe('LengthConverterModule', () => {
  let module: LengthConverterModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LengthConverterModule]
    });

    module = TestBed.inject(LengthConverterModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
