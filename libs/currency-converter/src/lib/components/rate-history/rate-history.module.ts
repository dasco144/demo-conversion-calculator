import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartsModule } from 'ng2-charts';
import { RateHistoryComponent } from './rate-history.component';

@NgModule({
  declarations: [RateHistoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatButtonModule,
    FlexLayoutModule,
    ChartsModule
  ]
})
export class RateHistoryModule {}
