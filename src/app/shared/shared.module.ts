import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDateComponent } from './input-date/input-date.component';
import { SelectComponent } from './select/select.component';
import {SharedService} from './shared.service';
import { RippleLink, ReadOnlyInput } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputDateComponent, SelectComponent, ReadOnlyInput, RippleLink],
  providers:[SharedService],
  exports: [InputDateComponent, SelectComponent, ReadOnlyInput, RippleLink],
})
export class SharedModule { }
