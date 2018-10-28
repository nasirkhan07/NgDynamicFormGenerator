import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponent } from './dynamic/dynamic.component';
import {CommonService} from'./common.service'
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,FormsModule
  ],
  declarations: [DynamicComponent],
providers:[CommonService],
exports:[DynamicComponent]
})
export class DynamicModule { }
