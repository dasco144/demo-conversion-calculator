import { TestBed } from '@angular/core/testing';
import { LengthConverterRoutingModule } from './length-converter-routing.module';

describe('LengthConverterRoutingModule', () => {
  let module: LengthConverterRoutingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LengthConverterRoutingModule]
    });

    module = TestBed.inject(LengthConverterRoutingModule);
  });

  it('should load module', () => {
    expect(module).toBeDefined();
  });
});
