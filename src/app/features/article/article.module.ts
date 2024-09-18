import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ArticleFormComponent } from './article-form/article-form.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlPipe } from '../../core/pipes/form-control.pipe';

@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleFormComponent,
    FormControlPipe
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    MaterialModule,
    ReactiveFormsModule ,
    FormsModule,
    QuillModule.forRoot(),


  ]
})
export class ArticleModule { }
