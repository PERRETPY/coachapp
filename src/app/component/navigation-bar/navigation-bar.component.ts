import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {ProgramService} from "../../service/program/program.service";
import {MetaDonnees} from "../../model/metadonnees.model";
import {GoogleAuthService} from "../../service/google-auth/google-auth.service";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  user: SocialUser;
  userSubscription: Subscription;

  isSpreadSheetSetSubscription: Subscription;

  infosMetaDonnees: MetaDonnees;
  infosMetaDonneesSubscription: Subscription = new Subscription();

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;


  constructor(private cd: ChangeDetectorRef,
              private googleAuthService: GoogleAuthService,
              private programService: ProgramService) {
    window.onSignIn = (googleUser) => this.onSignIn(googleUser);
  }

  ngOnInit(): void {
    this.userSubscription = this.googleAuthService.googleUserSubject.subscribe(
      (user: SocialUser) => {
        this.user = user;
        console.log('user subscription');
        this.cd.detectChanges();
      }
    );

    this.googleAuthService.emitGoogleUser();

    this.isSpreadSheetSetSubscription = this.programService.isSpreadSheetSetSubject.subscribe(
      (isSpreadSheetSet) => {
        if(isSpreadSheetSet) {
          this.loadData();
        }
      }
    );
  }

  public onSignIn(googleUser): void {
    this.googleAuthService.onSignIn(googleUser).then(
      () => {
        this.cd.detectChanges();
      }
    );
  }

  private onSignOut(): void {
    this.googleAuthService.signOut().then(
      () => {
        this.user = null;
        window.location.reload();
      }
    );
  }

  private getInfosMetaDonnees() {
    this.infosMetaDonneesSubscription = this.programService.infosMetaDonneesSubject.subscribe(
      (metaDonnees) => {
        this.infosMetaDonnees = metaDonnees;
      }
    );

    this.programService.getMetaDonnees().then(
      (infosMetaDonnees) => {
        this.infosMetaDonnees = infosMetaDonnees;
      }
    );
  }

  private getTraductionMap(): void {
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
        this.cd.detectChanges();
      }
    );

    this.programService.getTraduction().then(
      (traductionMap) => {
        this.traductionMap = traductionMap;
        this.cd.detectChanges();
      }).catch();
  }

  private loadData(): void {
    console.log('loadData()');
    if(!this.traductionMap || this.traductionMap.size < 1) {
      console.log('getTraduction from navigation-bar into loadData()');
      this.getTraductionMap();
    }
    if(!this.infosMetaDonnees) {
      this.getInfosMetaDonnees();
    }
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    console.log('on Destroy');

    if(this.traductionMapSubscription) {
      this.traductionMapSubscription.unsubscribe();
    }
    if(this.isSpreadSheetSetSubscription) {
      this.isSpreadSheetSetSubscription.unsubscribe();
    }
    if(this.infosMetaDonneesSubscription) {
      this.infosMetaDonneesSubscription.unsubscribe();
    }
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
