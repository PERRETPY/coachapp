import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from './service/google-auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProgramService } from './service/program.service';

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isSignedIn: boolean = false;
  public googleDisplay = "block";

  constructor(public gdata: GoogleAuthService,
    private cd: ChangeDetectorRef,
    public programService: ProgramService) {
    window.onSignIn = (googleUser) => this.onSignIn(googleUser);
  }

  onSignIn(googleUser) {
    this.gdata.onSignIn(googleUser);
    this.isSignedIn = this.gdata.isSignedIn;
    this.googleDisplay = this.gdata.googleDisplay;
    this.cd.detectChanges();
  }

  public async signOut() {
    await this.gdata.signOut();
    this.isSignedIn = this.gdata.isSignedIn;
    this.googleDisplay = this.gdata.googleDisplay;
    this.cd.detectChanges();
  }

  ngOnInit() {
   }
}
