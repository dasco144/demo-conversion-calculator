import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CURRENCY_PRECISION_TOKEN } from '../../constants/currency-constants';
import { CurrencyCodes } from '../../types/currency-codes';
import { CurrencySymbolMaskDirective } from './currency-symbol-mask.directive';

@Component({
  template: `<form [formGroup]="formGroup">
    <input
      [formControlName]="'value'"
      [demoCurrencySymbolMask]="currencyCode"
    />
  </form>`
})
class TestComponent {
  formGroup = new FormGroup({
    value: new FormControl()
  });
  currencyCode: CurrencyCodes = 'USD';
}

describe('CurrencyMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let el: DebugElement;

  let currencyPrecision: number;

  beforeEach(async () => {
    currencyPrecision = 2;

    await TestBed.configureTestingModule({
      declarations: [TestComponent, CurrencySymbolMaskDirective],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CURRENCY_PRECISION_TOKEN, useValue: currencyPrecision }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should attach directive to form control input', () => {
    const directive = el.query(By.directive(CurrencySymbolMaskDirective));

    expect(directive).toBeTruthy();
  });

  it('should update input value with symbol and value', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '123';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('$ 123');
  }));

  it('should update input value with symbol and value (with decimals)', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '123.12';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('$ 123.12');
  }));

  it('should update input value with symbol and value (round decimals)', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '123.123456';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('$ 123.12');
  }));

  it('should handle empty value', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('$ 0');
  }));

  it('should handle null value', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = null;
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('$ 0');
  }));

  it('should handle unit changing', fakeAsync(() => {
    component.currencyCode = 'ZAR';
    fixture.detectChanges();

    const input = el.query(By.css('input')).nativeElement;
    expect(input.value).toEqual('R 0');
  }));
});
