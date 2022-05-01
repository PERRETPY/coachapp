import { Component, OnInit } from '@angular/core';
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {AuthenticatorService} from "../../service/authenticator.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
