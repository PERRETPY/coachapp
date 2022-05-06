import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthenticatorService} from "../../service/authenticator.service";
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ProgramService} from "../../service/program.service";
import {MetaDonnees} from "../../model/metadonnees.model";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  user: SocialUser;
  userSubscription: Subscription;

  infosMetaDonnees: MetaDonnees;
  infosMetaDonneesSubscription: Subscription = new Subscription();


  constructor(private cd: ChangeDetectorRef,
              private authenticatorService: AuthenticatorService,
              private router: Router,
              private programService: ProgramService) { }

  ngOnInit(): void {
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
        this.getInfosMetaDonnees();
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
}
