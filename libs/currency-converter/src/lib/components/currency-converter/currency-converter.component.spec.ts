import { getCurrencySymbol } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { CurrencySymbolMaskModule } from '../../directives/currency-mask/currency-symbol-mask.module';
import { CurrencyRate } from '../../models/currency-rate';
import { CurrencyService } from '../../services/currency.service';
import { sampleRates } from '../../store/currency.reducer.spec';
import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let el: DebugElement;

  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let currencyRate: CurrencyRate;

  beforeEach(async () => {
    currencyServiceSpy = jasmine.createSpyObj<CurrencyService>(
      'CurrencyService',
      ['getCurrencyRate', 'loadCurrencyRate']
    );

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    mockActivatedRoute = new ActivatedRoute();

    currencyRate = {
      base: 'ZAR',
      date: '2020-11-07',
      rates: sampleRates
    };

    currencyServiceSpy.getCurrencyRate.and.returnValue(of(currencyRate));

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [
        MockModule(FlexLayoutModule),
        MockModule(ReactiveFormsModule),
        MockModule(MatFormFieldModule),
        MockModule(MatInputModule),
        MockModule(MatProgressSpinnerModule),
        MockModule(MatSelectModule),
        MockModule(CurrencySymbolMaskModule)
      ],
      providers: [
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(currencyServiceSpy.loadCurrencyRate).toHaveBeenCalledWith(
      currencyRate.base
    );
    expect(currencyServiceSpy.getCurrencyRate).toHaveBeenCalledWith(
      currencyRate.base
    );
  });

  describe('initialisation', () => {
    it('should handle no rates found for selected unit', fakeAsync(() => {
      currencyRate.rates = {};

      fixture.detectChanges();

      tick();

      const toUnit = component.currencyFormGroup.get('to.currency').value;
      const toValue = component.currencyFormGroup.get('to.value').value;
      const toSymbol = getCurrencySymbol(currencyRate.base, 'narrow');

      expect(toUnit).toEqual(currencyRate.base);
      expect(toValue).toEqual(`${toSymbol} 0`);
    }));
  });

  describe('template tests', () => {
    it('should create expected form fields', () => {
      fixture.detectChanges();

      const form = el.query(By.css('form'));

      expect(form).toBeTruthy();

      const fromFormControls = form.queryAll(
        By.css('div[formGroupName="from"] > mat-form-field')
      );
      expect(fromFormControls.length).toEqual(2);

      const fromSelect = fromFormControls[0].query(
        By.css('mat-select[formControlName="currency"]')
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
        By.css('mat-select[formControlName="currency"]')
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

      getControlSpy = spyOn(
        component.currencyFormGroup,
        'get'
      ).and.callThrough();
    });

    it('should handle from.currency value change set appropriate form values', fakeAsync(() => {
      component.currencyFormGroup.get('from.value').setValue('R 100');
      const setValueSpy = spyOn(
        component.currencyFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      const newCurrencyRate: CurrencyRate = {
        base: 'USD',
        date: '2020-11-07',
        rates: sampleRates
      };
      currencyServiceSpy.getCurrencyRate.and.returnValue(of(newCurrencyRate));

      component.currencyFormGroup
        .get('from.currency')
        .setValue(newCurrencyRate.base);

      // Tick to get past the debounce
      tick(105);
      fixture.detectChanges();
      tick();

      expect(currencyServiceSpy.loadCurrencyRate).toHaveBeenCalledWith(
        newCurrencyRate.base
      );
      expect(currencyServiceSpy.getCurrencyRate).toHaveBeenCalledWith(
        newCurrencyRate.base
      );
      expect(getControlSpy).toHaveBeenCalledWith('to.currency');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle to.currency value change and set appropriate form values', fakeAsync(() => {
      component.currencyFormGroup.get('to.value').setValue('R 100');
      const setValueSpy = spyOn(
        component.currencyFormGroup.get('from.value'),
        'setValue'
      ).and.callThrough();

      component.currencyFormGroup.get('to.currency').setValue('USD');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('from.currency');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle from.value value change and set appropriate form values', fakeAsync(() => {
      const setValueSpy = spyOn(
        component.currencyFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      component.currencyFormGroup.get('from.value').setValue('R 100');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('to.value');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle to.value value change and set appropriate form values', fakeAsync(() => {
      const setValueSpy = spyOn(
        component.currencyFormGroup.get('from.value'),
        'setValue'
      ).and.callThrough();

      component.currencyFormGroup.get('to.value').setValue('R 100');

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('from.value');
      expect(setValueSpy).toHaveBeenCalled();
    }));

    it('should handle 0 value input', fakeAsync(() => {
      component.currencyFormGroup.get('from.value').setValue('R 0');
      const setValueSpy = spyOn(
        component.currencyFormGroup.get('to.value'),
        'setValue'
      ).and.callThrough();

      // Tick to get past the debounce
      tick(105);

      expect(getControlSpy).toHaveBeenCalledWith('to.currency');
      expect(setValueSpy).toHaveBeenCalledWith('0', { emitEvent: false });
    }));
  });

  describe('loading indicator', () => {
    it('should disable forms while loading', fakeAsync(() => {
      fixture.detectChanges();

      component.loading$.next(true);
      tick();

      expect(component.currencyFormGroup.enabled).toEqual(false);

      component.loading$.next(false);
      tick();

      expect(component.currencyFormGroup.enabled).toEqual(true);
    }));
  });

  describe('navigation', () => {
    it('should navigate to history route', () => {
      fixture.detectChanges();
      component.navigateToHistory();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['history'], {
        relativeTo: mockActivatedRoute as ActivatedRoute,
        state: {
          baseCurrency: component.selectedCurrencyRate.base,
          compareRate: component.currencyFormGroup.get('to.currency').value
        }
      });
    });
  });
});
