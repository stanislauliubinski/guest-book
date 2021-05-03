import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signupForm: FormGroup
  formData: FormData = new FormData()
  submitSub: Subscription
  passwordsMatch: boolean
  imgFile: string
  avatarName: string = ''

  constructor(private auth: AuthService, private router: Router, private alert: AlertService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      avatar: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255)
      ]),
      password_confirmation: new FormControl('', [
        Validators.required
      ])
    })
  }

  onFileChanged(event) {
    const avatar: File = event.target.files[0];
    if (avatar.size > 1048576) {
      this.alert.failure('Max file size is 1MB!')
      event.target.value = ''
      this.signupForm.get('avatar').setErrors({'incorrect': true})
    } else if (avatar) {
      this.avatarName = avatar.name
      this.formData.append('avatar', avatar)
    }
  }

  confirmPassword() {
    const password = this.signupForm.get('password').value;
    const confirmPassword = this.signupForm.get('password_confirmation').value;
    if (password !== confirmPassword) {
      this.signupForm.get('password_confirmation').setErrors({'incorrect': true})
    }
  }

  submit() {
    this.formData.set('password', this.signupForm.value.password)
    this.formData.set('email', this.signupForm.value.email)
    this.formData.set('name', this.signupForm.value.name)
    this.formData.set('password_confirmation', this.signupForm.value.password_confirmation)
    if (this.signupForm.invalid) {
      this.getFormValidationErrors()
    } else {
      this.submitSub = this.auth.register(this.formData).subscribe(() => {
        this.signupForm.reset()
        this.router.navigate(['/posts'])
      }, () => {
        this.signupForm.reset()
        this.signupForm.controls.email.setErrors({'invalid': true})
        this.signupForm.controls.name.setErrors({'invalid': true})
        this.signupForm.controls.password.setErrors({'invalid': true})
        this.signupForm.controls.password_confirmation.setErrors({'invalid': true})
        this.signupForm.markAllAsTouched()
      })
    }
  }

  getFormValidationErrors(): string {
    Object.keys(this.signupForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.signupForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(() => {
          this.signupForm.markAllAsTouched()
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
