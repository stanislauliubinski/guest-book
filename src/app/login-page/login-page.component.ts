
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { User } from '../interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  submitSub: Subscription

  constructor(private auth: AuthService, private router: Router, private alert: AlertService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  submit() {
    const user: User = this.loginForm.value;
    
    if (this.loginForm.invalid) {
      this.getFormValidationErrors()
    } else {
      this.submitSub = this.auth.login(user).subscribe(() => {
        this.loginForm.reset()
        this.router.navigate(['/posts'])
      }, () => {
        this.loginForm.reset()
        this.loginForm.controls.email.setErrors({'invalid': true})
        this.loginForm.controls.password.setErrors({'invalid': true})
        this.loginForm.markAllAsTouched()
      })
  }}

  getFormValidationErrors(): string {
    Object.keys(this.loginForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.loginForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(() => {
          this.loginForm.markAllAsTouched()
        });
      }
      return key.toString()
    } );
    return
  }

  ngOnDestroy() {
    if (this.submitSub) {
      this.submitSub.unsubscribe()
    }
  }
}
