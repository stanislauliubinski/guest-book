import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'guest-book';
  constructor(public auth: AuthService, public socket: SocketService) {}
}

