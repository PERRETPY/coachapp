import { Component, OnInit } from '@angular/core';
import {SocialAuthService, SocialUser} from "angularx-social-login";
import {AuthenticatorService} from "../../service/authenticator.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: SocialUser;

  constructor(private authService: SocialAuthService,
              private authenticatorService: AuthenticatorService) { }

  ngOnInit(): void {
    this.authenticatorService.userSubject.subscribe(user => {
      this.user = user;
    });
    this.authenticatorService.emitUserSubject();
  }

  signInWithGoogle(): void {
    this.authenticatorService.signInWithGoogle();
  }

  signOut(): void {
    this.authenticatorService.signOut();
  }

}
