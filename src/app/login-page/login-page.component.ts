import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    if (this.loginForm.invalid) {
      this.alert.failure('Login failed!')
    }
    this.submitSub = this.auth.login(user).subscribe(() => {
      this.loginForm.reset()
      this.router.navigate(['/posts'])
    }, () => {
      this.alert.failure('Login failed')
      this.loginForm.reset()
      // this.loginForm.controls.email.setErrors({'invalid': true})
      // this.loginForm.controls.password.setErrors({'invalid': true})
    })
  }

  ngOnDestroy() {
    if (this.submitSub) {
      this.submitSub.unsubscribe()
    }
  }
}
