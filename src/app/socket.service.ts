import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { push, pushPrivate } from './interfaces';

@Injectable()
export class SocketService {

  echo: Echo;
  pushedData = new Subject()
  pushedDataPrivate = new Subject()

  constructor(private auth: AuthService) {
    let idToken = localStorage.getItem('id_token')
    this.echo = new Echo ({
      broadcaster: 'pusher',
      key: 'key',
      wsHost: 'guest-book.naveksoft.com',
      wsPort: '6001',
      wssPort: '443',
      wsPath: '/ws',
      encrypted: true,
      authEndpoint: 'https://guest-book.naveksoft.com/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${idToken}`,
          Accept: `application/json`
        },
      },
      enabledTransports: ['ws', 'wss'], // https://github.com/beyondcode/laravel-websockets/issues/86
      disableStats: true,
    })

    this.auth.tokenSubject.subscribe(token => {
      this.echo.options.auth.headers.Authorization = `Bearer ${token}`
    })   
    
    this.auth.userIdSubject.subscribe(id => { 
      if (id) {
        this.connectAndListen()
        this.connectPrivate(id)
      } else {
        this.leaveAll(this.echo)
      }
    })   
  }

  private leaveAll(echo: Echo): void {
    if (echo && echo.connector) {
      for (const key in echo.connector.channels) {
        if (echo.connector.channels.hasOwnProperty(key)) {
          echo.leave(key);
        }
      }
    }
  }

  connectAndListen(){
    this.echo.connect()
    this.echo.channel('posts')
      .listen('PublicPush', (e: push) => {
        this.pushedData.next(e.data)
      })  
  }

  connectPrivate(id){
    this.echo.private('user.' + id)    
      .listen('UserPush', (e: pushPrivate) => {
        this.pushedDataPrivate.next(e.data)
      })  
  }
}