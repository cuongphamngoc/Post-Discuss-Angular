import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ChatboxRoutingModule } from './chatbox-routing.module';
import { ChatboxComponent } from './chatbox.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from '../../core/pipes/reply-truncate.pipe';


@NgModule({
  declarations: [
    ChatboxComponent,
    TruncatePipe,

  ],
  imports: [
    CommonModule,
    ChatboxRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class ChatboxModule { }
