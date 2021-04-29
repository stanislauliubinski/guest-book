import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserModule } from './posts/user.module';
import { SignupPageComponent } from './signup-page/signup-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: '*', redirectTo: '/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    UserModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
