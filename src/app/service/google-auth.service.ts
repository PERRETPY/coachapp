import {EventEmitter, Injectable} from '@angular/core';
import {JsLoaderService} from './js-loader.service';
import {Subject} from "rxjs";
import {SocialUser} from "angularx-social-login";

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
  public googleUser: SocialUser;
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
    console.log('onSignIn');
    this.setGoogleUser(googleUser);
    this.emitGoogleUser();
    this.isSignedIn = true;
    this.googleDisplay = "none";
    this.signIn.emit();
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  emitGoogleUser() {
    const googleUser = this.googleUser;
    this.googleUserSubject.next(googleUser);
  }

  public async signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    await auth2.signOut().then(() => {
      this.isSignedIn = false;
      this.googleDisplay = "block";
      localStorage.removeItem('sheetId');
      this.signedOut.emit();
    });
  }

  public async loadClient() {
    return new Promise<void>((resolve) => {
      gapi.load("client:auth2", () => {
          resolve();
        },
        (error) => {
          console.log("Error loading client: "
            + JSON.stringify(error));
        });
    });
  }

  public async loadSheetsAPI() {
    return new Promise<void>((resolve) => {
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
  }

  public async loadGmail() {
    return new Promise<void>((resolve) => {
      gapi.client.load('gmail', 'v1', () => {
        resolve();
      })
    });
  }

  private setGoogleUser(googleUser) {
    let gu = new SocialUser();

    const profile = googleUser.getBasicProfile();

    gu.id = profile.getId();
    gu.email = profile.getEmail();
    gu.name = profile.getName();
    gu.photoUrl = profile.getImageUrl();
    gu.firstName = profile.getGivenName();
    gu.lastName = profile.getFamilyName();

    this.googleUser = gu;
  }

  public sendEmail(to: string, subject: string, commentaire: string) {

    const message =
      "From: " + this.googleUser.email + "\r\n" +
      "To: "+to+"\r\n" +
      "Subject: "+subject+"\r\n\r\n" +
      this.googleUser.name + ' a commenté : "' + commentaire + '"';

    const encodedMessage = btoa(message)

    const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    this.loadClient().then(
      () => {
        this.loadGmail().then(
          () => {
            gapi.client.gmail.users.messages.send({
              'userId': this.googleUser.id,
              'resource': {
                'raw': reallyEncodedMessage
              }
            }).then(() => {

              },
              (error) => {
                console.log(error);
              });
          }
        )
      }
    );

  }
}
