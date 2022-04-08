import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticatorService} from "../../service/authenticator.service";
import {Subscription} from "rxjs";
import {SocialUser} from "angularx-social-login";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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


  logOut(): void {
    this.authenticatorService.signOut();
    this.router.navigate(['/']);
  }

}
