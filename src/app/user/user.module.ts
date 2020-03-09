import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent} from './sign-up/sign-up.component';
import { RouterModule, Route } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes = [{path: 'signup', component: SignUpComponent}]


@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
