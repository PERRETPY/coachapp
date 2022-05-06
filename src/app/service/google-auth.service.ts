import { Injectable, EventEmitter } from '@angular/core';
import { JsLoaderService } from './js-loader.service';
import {Subject} from "rxjs";

declare global {
  var gapi;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  public javascriptFile = "https://apis.google.com/js/platform.js";
  public isSignedIn: boolean = false;
  public googleDisplay = "block";
  public googleUser: any;
  public googleUserSubject: Subject<any> = new Subject<any>();
  public signIn: EventEmitter<void> = new EventEmitter<void>();
  public signedOut: EventEmitter<void> = new EventEmitter<void>();

  constructor(public loader: JsLoaderService) {

    console.log("Loading the javascript API file.");
    this.loader.loadjs(this.javascriptFile).then(() => {
      // file loaded
    });
  }

  public onSignIn(googleUser) {
    this.googleUser = googleUser;
    this.emitGoogleUser();
    console.log("signed in");
    this.isSignedIn = true;
    this.googleDisplay = "none";
    this.signIn.emit();
  }

  emitGoogleUser() {
    const googleUser = this.googleUser;
    this.googleUserSubject.next(googleUser);
  }

  public async signOut() {
    console.log('Signing out.');
    let auth2 = gapi.auth2.getAuthInstance();
    await auth2.signOut().then(() => {
      console.log("signed out");
      this.isSignedIn = false;
      this.googleDisplay = "block";
      localStorage.removeItem('sheetId');
      this.signedOut.emit();
    });
  }

  public async loadClient() {
    let p = new Promise<void>((resolve) => {
      gapi.load("client:auth2", () => {
          resolve();
        },
        (error) => {
          console.log("Error loading client: "
            + JSON.stringify(error));
        });
    });
    return p;
  }

  public async loadSheetsAPI() {
    let p = new Promise<void>((resolve) => {
      gapi.client.load(
        'https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            resolve();
          },
          (error) => {
            console.log("Error loading SheetsAPI: "
              + JSON.stringify(error));
          });
    });
    return p;
  }
}
