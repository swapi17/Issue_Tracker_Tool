import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {IssueCreateComponent} from './../app/issue-create/issue-create.component';
import {IssueViewComponent} from './../app/issue-view/issue-view.component'
import {IssueEditComponent} from './issue-edit/issue-edit.component'
import{AuthGuard} from './auth.guard';
import { NgxEditorModule } from 'ngx-editor'
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {FileUploadModule} from 'ng2-file-upload'

@NgModule({
  declarations: [DashboardComponent, IssueCreateComponent, IssueViewComponent, IssueEditComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    BrowserAnimationsModule,
    NgxEditorModule,
    FormsModule,
    TooltipModule.forRoot(),
    RouterModule.forChild([
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path:'issue-create', component: IssueCreateComponent, canActivate: [AuthGuard]},
      {path:'issue-view/:issueId', component: IssueViewComponent, canActivate: [AuthGuard]},
      {path:'issue-edit/:issueId', component: IssueEditComponent, canActivate: [AuthGuard]}
    ])
  ],
  providers: [AuthGuard]
})
export class DashboardModule { }
