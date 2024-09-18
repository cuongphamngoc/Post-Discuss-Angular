import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussRoutingModule } from './discuss-routing.module';
import { DiscussComponent } from './discuss.component';
import { DiscussFormComponent } from './discuss-form/discuss-form.component';
import { DiscussDetailComponent } from './discuss-detail/discuss-detail.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    DiscussComponent,
    DiscussFormComponent,
    DiscussDetailComponent
  ],
  imports: [
    CommonModule,
    DiscussRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ]
})
export class DiscussModule { }
