import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LENGTH_PRECISION_TOKEN } from '../constants/length-constants';
import { LengthSymbolMaskDirective } from './length-symbol-mask.directive';

@Component({
  template: `<form [formGroup]="formGroup">
    <input [formControlName]="'value'" [demoLengthSymbolMask]="unit" />
  </form>`
})
class TestComponent {
  formGroup = new FormGroup({
    value: new FormControl()
  });
  unit = 'meter';
}

describe('LengthUnitMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let el: DebugElement;

  let lengthPrecision: number;

  beforeEach(async () => {
    lengthPrecision = 5;

    await TestBed.configureTestingModule({
      declarations: [TestComponent, LengthSymbolMaskDirective],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LENGTH_PRECISION_TOKEN, useValue: lengthPrecision }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should attach directive to form control input', () => {
    const directive = el.query(By.directive(LengthSymbolMaskDirective));

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

    expect(input.value).toEqual('123 m');
  }));

  it('should update input value with symbol and value (with decimals)', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '123.123';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('123.123 m');
  }));

  it('should update input value with symbol and value (round decimals)', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '123.123456';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('123.12346 m');
  }));

  it('should handle empty value', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = '';
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('0 m');
  }));

  it('should handle null value', fakeAsync(() => {
    let input: HTMLInputElement = el.query(By.css('input')).nativeElement;
    input.value = null;
    const event = new Event('input', { bubbles: true, cancelable: false });
    input.dispatchEvent(event);

    tick();
    fixture.detectChanges();

    input = el.query(By.css('input')).nativeElement;

    expect(input.value).toEqual('0 m');
  }));

  it('should handle unit changing', fakeAsync(() => {
    component.unit = 'foot';
    fixture.detectChanges();

    const input = el.query(By.css('input')).nativeElement;
    expect(input.value).toEqual('0 ft');
  }));
});
