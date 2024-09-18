import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeModule } from './features/home/home.module';
import { AuthModule } from './features/auth/auth.module';
import { MaterialModule } from './shared/material/material.module';
import { AuthlayoutComponent } from './shared/layout/authlayout/authlayout.component';
import { MainlayoutComponent } from './shared/layout/mainlayout/mainlayout.component';
import { HeaderComponent } from './shared/layout/partials/header/header.component';
import { FooterComponent } from './shared/layout/partials/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './features/error/error.component';
import { QuillModule } from 'ngx-quill';
import { AuthInterceptor } from './core/interceptors/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AuthlayoutComponent,
    MainlayoutComponent,
    HeaderComponent,
    FooterComponent,
    ErrorComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HomeModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QuillModule.forRoot()
  ],
  providers: [
    provideAnimationsAsync(),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
