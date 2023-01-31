import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule ,Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddEmployeePageRoutingModule } from './add-employee-routing.module';
import { AddEmployeePage } from './add-employee.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEmployeePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AddEmployeePage]
})
export class AddEmployeePageModule {}
