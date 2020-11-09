import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { LengthSymbolMaskModule } from '../../directives/length-symbol-mask.module';
import { LengthConverterComponent } from './length-converter.component';

@NgModule({
  declarations: [LengthConverterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    LengthSymbolMaskModule
  ],
  exports: [],
  providers: []
})
export class LengthConverterModule {}
