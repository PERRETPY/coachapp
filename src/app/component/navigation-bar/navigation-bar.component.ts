import { Component, OnInit } from '@angular/core';
import {AuthenticatorService} from "../../service/authenticator.service";
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  user: SocialUser;
  userSubscription: Subscription;


  constructor(private authenticatorService: AuthenticatorService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
      }
    );
    this.authenticatorService.emitUserSubject();
  }

  onSignIn() {
    this.authenticatorService.signInWithGoogle();
  }

  onSignOut() {
    this.authenticatorService.signOut();
    this.user = null;
    this.router.navigate(['/']);
  }

}
