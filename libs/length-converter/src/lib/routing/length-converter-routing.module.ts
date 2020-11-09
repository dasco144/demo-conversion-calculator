import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LengthConverterComponent } from '../components/length-converter/length-converter.component';
import { LengthConverterModule } from '../components/length-converter/length-converter.module';

@NgModule({
  declarations: [],
  imports: [
    LengthConverterModule,
    RouterModule.forChild([
      {
        path: '',
        component: LengthConverterComponent
      }
    ])
  ],
  exports: [],
  providers: []
})
export class LengthConverterRoutingModule {}
