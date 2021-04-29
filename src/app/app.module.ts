import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './posts/user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { AuthInterceptor } from './auth.interceptor';
import { AlertComponent } from './alert/alert.component';
import { PostsComponent } from './posts/posts.component';

import { AlertService } from './alert.service';
import { AuthService } from './auth.service'
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserModule
  ],
  exports: [],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AlertService, AuthService, SocketService, PostsComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

