import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';
import { LENGTH_PRECISION_TOKEN } from '../../constants/length-constants';
import { lengthConversionUnits } from '../../constants/length-conversion-units';
import { LengthSymbolMaskModule } from '../../directives/length-symbol-mask.module';
import { LengthConverterComponent } from './length-converter.component';

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;
  let el: DebugElement;

  let lengthPrecision: number;

  beforeEach(async () => {
    lengthPrecision = 5;

    await TestBed.configureTestingModule({
      declarations: [LengthConverterComponent],
      imports: [
        MockModule(ReactiveFormsModule),
        MockModule(MatInputModule),
        MockModule(MatSelectModule),
        MockModule(MatFormFieldModule),
        MockModule(MatInputModule),
        MockModule(MatSelectModule),
        MockModule(MatProgressSpinnerModule),
        MockModule(FlexLayoutModule),
        MockModule(LengthSymbolMaskModule)
      ],
      providers: [
        { provide: LENGTH_PRECISION_TOKEN, useValue: lengthPrecision }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should handle no rates found for selected unit', () => {
      const selectedUnit = lengthConversionUnits[0];
      selectedUnit.rates = {};
      fixture.detectChanges();

      const toUnit = component.lengthFormGroup.get('to.unit').value;
      const toValue = component.lengthFormGroup.get('to.value').value;
      const toSymbol = lengthConversionUnits.find(
        (unit) => unit.base === toUnit
      ).symbol;

      expect(toUnit).toEqual(selectedUnit.base);
      expect(toValue).toEqual(`0 ${toSymbol}`);
    });
  });

  describe('template tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create expected form fields', () => {
      const form = el.query(By.css('form'));

      expect(form).toBeTruthy();

      const fromFormControls = form.queryAll(
        By.css('div[formGroupName="from"] > mat-form-field')
      );
      expect(fromFormControls.length).toEqual(2);

      const fromSelect = fromFormControls[0].query(
        By.css('mat-select[formControlName="unit"]')
      );
      expect(fromSelect).toBeTruthy();

      const fromValue = fromFormControls[1].query(
        By.css('input[matinput][formControlName="value"]')
      );
      expect(fromValue).toBeTruthy();

      const toFormControls = form.queryAll(
        By.css('div[formGroupName="to"] > mat-form-field')
      );
      expect(toFormControls.length).toEqual(2);

      const toSelect = toFormControls[0].query(
        By.css('mat-select[formControlName="unit"]')
      );
      expect(toSelect).toBeTruthy();

      const toValue = toFormControls[1].query(
        By.css('input[matinput][formControlName="value"]')
      );
      expect(toValue).toBeTruthy();
    });
  });

  describe('value changes', () => {
    let getControlSpy: jasmine.Spy;

    beforeEach(() => {
      fixture.detectChanges();

      getControlSpy = spyOn(component.lengthFormGroup, 'get').and.callThrough();
    });

    it('should handle from.unit value change set appropriate form values', fakeAsync(() => {
      component.lengthFormGroup.get('from.value').setValue('100 m');
      const setValueSpy = spyOn(
        component.lengthFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      component.lengthFormGroup.get('from.unit').setValue('yard');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('to.unit');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle to.unit value change and set appropriate form values', fakeAsync(() => {
      component.lengthFormGroup.get('to.value').setValue('100 m');
      const setValueSpy = spyOn(
        component.lengthFormGroup.get('from.value'),
        'setValue'
      ).and.callThrough();

      component.lengthFormGroup.get('to.unit').setValue('yard');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('from.unit');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle from.value value change and set appropriate form values', fakeAsync(() => {
      const setValueSpy = spyOn(
        component.lengthFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      component.lengthFormGroup.get('from.value').setValue('100 m');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('to.value');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle to.value value change and set appropriate form values', fakeAsync(() => {
      const setValueSpy = spyOn(
        component.lengthFormGroup.get('from.value'),
        'setValue'
      ).and.callThrough();

      component.lengthFormGroup.get('to.value').setValue('100 m');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('from.value');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle 0 value input', fakeAsync(() => {
      component.lengthFormGroup.get('from.value').setValue('0 m');
      const setValueSpy = spyOn(
        component.lengthFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('to.unit');
      expect(setValueSpy).toHaveBeenCalledWith('0', { emitEvent: false });
    }));
  });
});
