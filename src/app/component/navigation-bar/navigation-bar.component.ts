import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "../../service/authenticator.service";
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ProgramService} from "../../service/program.service";
import {MetaDonnees} from "../../model/metadonnees.model";
import {GoogleAuthService} from "../../service/google-auth.service";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  user: SocialUser;
  userSubscription: Subscription;

  user2: any;
  user2Subscription: Subscription;

  infosMetaDonnees: MetaDonnees;
  infosMetaDonneesSubscription: Subscription = new Subscription();


  constructor(private cd: ChangeDetectorRef,
              private authenticatorService: AuthenticatorService,
              private googleAuthService: GoogleAuthService,
              private router: Router,
              private programService: ProgramService) {
    window.onSignIn = (googleUser) => this.onSignIn(googleUser);
  }

  ngOnInit(): void {
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
        if(this.user && this.spreadSheetIsSet()) {
          this.getInfosMetaDonnees();
        }
      }
    );
    this.authenticatorService.emitUserSubject();
  }

  onSignIn(googleUser) {
    this.googleAuthService.onSignIn(googleUser);
    this.authenticatorService.signInWithGoogle();
    this.user2Subscription = this.googleAuthService.googleUserSubject.subscribe(
      (user) => {
        this.user2 = user;
        this.user = new SocialUser();
        this.user.name = this.user2.getBasicProfile().getName();
        this.authenticatorService.user = this.user;
        this.authenticatorService.emitUserSubject();
      }
    );
    this.googleAuthService.emitGoogleUser();
    console.log(this.user2.getBasicProfile());
  }

  onSignOut() {
    this.authenticatorService.signOut();
    this.user = null;
  }

  private getInfosMetaDonnees() {
    this.infosMetaDonneesSubscription = this.programService.infosMetaDonneesSubject.subscribe(
      (infoMetaDonnees) => {
        this.infosMetaDonnees = infoMetaDonnees;
      }
    );
    this.programService.emitMetaDonnees();
    this.programService.getMetaDonnees();
    this.cd.detectChanges();
  }

  spreadSheetIsSet(): boolean {
    return localStorage.getItem('sheetId') && true;
  }
}
