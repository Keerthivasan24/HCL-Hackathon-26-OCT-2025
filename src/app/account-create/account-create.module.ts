import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountCreateComponent } from './account-create.component';

const routes = [
  { path: '', component: AccountCreateComponent }
];

@NgModule({
  declarations: [
    AccountCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountCreateModule { }
