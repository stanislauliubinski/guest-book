import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserModule } from './posts/user.module';
import { SignupPageComponent } from './signup-page/signup-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'page_not_found', component: ErrorPageComponent},
  {path: '**', redirectTo: '/page_not_found'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    UserModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
