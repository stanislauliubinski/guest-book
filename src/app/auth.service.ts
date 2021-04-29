import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, User } from './interfaces';
import { tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  userIdSubject = new BehaviorSubject(localStorage.getItem('user_id'))
  tokenSubject = new Subject()
  userNameSubject = new Subject()
  userEmailSubject = new Subject()
  userAvatarSubject = new Subject()

  login(user: User) {
    return this.http.post<AuthResponse>('https://guest-book.naveksoft.com/api/v1/auth/login', user)
      .pipe(
        tap(res => {
          this.setSession(res)
        }
      ))
  }

  register(formData: FormData) {
    return this.http.post<AuthResponse>('https://guest-book.naveksoft.com/api/v1/auth/register', formData)
      .pipe(
        tap((res) => {
          this.setSession(res)
        })
      )
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('id_token', res.token.access_token)
    localStorage.setItem('user_id', res.user.id.toString())
    localStorage.setItem('is_admin', res.user.is_admin.toString())
    localStorage.setItem('user_name', res.user.name)
    localStorage.setItem('user_email', res.user.email)
    localStorage.setItem('user_avatar', res.user.avatar)
    this.tokenSubject.next(res.token.access_token)
    this.userIdSubject.next(res.user.id.toString())
    this.userNameSubject.next(res.user.name)
    this.userEmailSubject.next(res.user.email)
    this.userAvatarSubject.next(res.user.avatar) 
  }

  logout() {
    this.router.navigate(['/login'], {
      queryParams: {
        loginRequired: true
      }
    })
    localStorage.removeItem('id_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('is_admin')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_avatar')
    this.userIdSubject.next('')
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('id_token') 
  }
}

