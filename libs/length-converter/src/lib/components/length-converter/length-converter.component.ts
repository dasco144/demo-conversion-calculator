import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  LENGTH_PRECISION_TOKEN,
  maskRegex
} from '../../constants/length-constants';
import { lengthConversionUnits } from '../../constants/length-conversion-units';
import {
  conversionUnitOp,
  conversionValueOp
} from '../../functions/custom-operators';
import { precisionHelper } from '../../functions/precision-helpers';
import { LengthUnit } from '../../models/length-unit';

@Component({
  selector: 'demo-length-converter',
  templateUrl: './length-converter.component.html',
  styleUrls: ['./length-converter.component.scss']
})
export class LengthConverterComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  lengthFormGroup: FormGroup;

  selectedLengthUnit: LengthUnit;

  // Make the constant available in the template
  lengthConversionUnits = lengthConversionUnits;

  constructor(
    @Inject(LENGTH_PRECISION_TOKEN) private lengthPrecision: number
  ) {}

  ngOnInit(): void {
    this.initialise();
  }

  ngOnDestroy(): void {
    // Destroy all subscriptions using takeUntil operator
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private initialise(): void {
    this.selectedLengthUnit = lengthConversionUnits[0];

    this.buildForm(this.selectedLengthUnit);
  }

  private buildForm(lengthUnit: LengthUnit): void {
    // Filter out base, and select first rate for the to currency field
    const toUnit =
      Object.keys(lengthUnit.rates)
        .filter((key) => key !== lengthUnit.base)
        .sort((a, b) => a.localeCompare(b))[0] || lengthUnit.base;

    // Retrieve the symbols for the currently set units from our static data
    const fromSymbol = lengthUnit.symbol;
    const toSymbol = lengthConversionUnits.find((unit) => unit.base === toUnit)
      .symbol;

    // Create the form group using reactive form method
    this.lengthFormGroup = new FormGroup({
      from: new FormGroup({
        unit: new FormControl(lengthUnit.base),
        value: new FormControl(`0 ${fromSymbol}`)
      }),
      to: new FormGroup({
        unit: new FormControl(toUnit),
        value: new FormControl(`0 ${toSymbol}`)
      })
    });

    // Setup our subscriptions for form value changes
    this.setupValueChange();
  }

  private setupValueChange(): void {
    // Subscribe to value changes for all the current form controls
    this.lengthFormGroup
      .get('from.unit')
      .valueChanges.pipe(
        conversionUnitOp<string>(() => this.changeUnit('from')),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.lengthFormGroup
      .get('to.unit')
      .valueChanges.pipe(
        conversionUnitOp<string>(() => this.changeUnit('to')),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.lengthFormGroup
      .get('from.value')
      .valueChanges.pipe(
        conversionValueOp((value) => this.calculateConversion(value, 'from')),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.lengthFormGroup
      .get('to.value')
      .valueChanges.pipe(
        conversionValueOp((value) => this.calculateConversion(value, 'to')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private changeUnit(source: 'from' | 'to'): void {
    // Update the selected unit with the mapping from lengthConversionUnits
    if (source === 'from') {
      const fromUnit: string = this.lengthFormGroup.get(`${source}.unit`).value;
      this.selectedLengthUnit = lengthConversionUnits.find(
        (unit) => unit.base === fromUnit
      );
    }

    // Get the target value to update the form value with rounded value
    const formValue: string = this.lengthFormGroup.get(`${source}.value`).value;
    const numValue = Number(formValue.replace(maskRegex, ''));

    // Get the amount of precision to use
    const precision = precisionHelper(
      numValue.toString(),
      this.lengthPrecision
    );

    this.lengthFormGroup
      .get(`${source}.value`)
      .setValue(numValue.toFixed(precision), {
        emitEvent: false
      });

    // Calculate the conversion and update the target value form control
    this.calculateConversion(numValue, source);
  }

  private calculateConversion(input: number, source: 'from' | 'to'): void {
    const target = source === 'from' ? 'to' : 'from';

    // Cater for 0 value
    if (input === 0) {
      this.lengthFormGroup
        .get(`${target}.value`)
        .setValue('0', { emitEvent: false });
    }

    let targetUnit: string = this.lengthFormGroup.get(`${target}.unit`).value;
    let targetValue: number;

    // If the unit is the currently selected unit then get the source unit and use that instead,
    // else, just get the rate using the target unit
    if (targetUnit === this.selectedLengthUnit.base) {
      targetUnit = this.lengthFormGroup.get(`${source}.unit`).value;
      const rate = this.selectedLengthUnit.rates[targetUnit];
      targetValue = input / rate;
    } else {
      const rate = this.selectedLengthUnit.rates[targetUnit];
      targetValue = rate * input;
    }

    // Get the amount of precision to use
    const precision = precisionHelper(
      targetValue.toString(),
      this.lengthPrecision
    );

    this.lengthFormGroup
      .get(`${target}.value`)
      .setValue(targetValue.toFixed(precision), {
        emitEvent: false
      });
  }
}
