import {EventEmitter, Injectable} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {


  socialUser: SocialUser = new SocialUser();
  user: SocialUser;

  userSubject = new Subject<any>();

  public signIn: EventEmitter<void> = new EventEmitter<void>();
  public signedOut: EventEmitter<void> = new EventEmitter<void>();


  constructor(private httpClient: HttpClient, private authService: SocialAuthService) {
    this.authService.authState.subscribe(user => {
      this.socialUser = user;
    });
    if (localStorage.getItem('auth') === 'undefined' || localStorage.getItem('auth') === null) {
      this.user = null;
    } else {
      this.user = JSON.parse(localStorage.getItem('auth')!);
    }
  }

  getToken(): string {
    this.refreshGoogleToken().then(r => console.log(r));
    return this.user.idToken;
  }

  signInWithGoogle(): void {
    console.log('Sign In with Google !');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      response => {
        this.saveUser();
        this.signIn.emit();
      }
    );
  }

  signOut(): void {
    this.authService.signOut().then(r => console.log(r));
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      this.destroySheetId();
      this.signedOut.emit();
      this.destroyUser();
      this.emitUserSubject();
    });
  }

  refreshGoogleToken(): Promise<void> {
    return this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then(
      response => {
        this.saveUser();
      }
    );
  }

  emitUserSubject(): void {
    const userCopy = this.user;
    this.userSubject.next(userCopy);
  }

  saveUser(): void{
    this.user = this.socialUser;
    console.log('saveUser, user : ' + this.user.email);
    localStorage.setItem('auth', JSON.stringify(this.user));
    this.emitUserSubject();
  }

  destroyUser(): void{
    this.user = null;
    localStorage.removeItem('auth');
  }

  destroySheetId(): void {
    localStorage.removeItem('sheetId');
  }


  sendEmail(to: string, subject: string, corps: string) {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
    ].join(' ');

    const message =
      "From: pierreyves.perret@gmail.com\r\n" +
      "To: "+to+"\r\n" +
      "Subject: "+subject+"\r\n\r\n" +
      corps;

    const encodedMessage = btoa(message)

    const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    this.loadClient().then(
      () => {
        this.loadGmail().then(
          () => {
            gapi.client.gmail.users.messages.send({
              'userId': this.user.id,
              'resource': {
                'raw': reallyEncodedMessage
              }
            }).then(res => {
              console.log("done!", res)
            },
              (error) => {
              console.log(error);
              });
          }
        )
      }
    );

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

  public async loadGmail() {
    let p = new Promise<void>((resolve) => {
      gapi.client.load('gmail', 'v1', () => {
        resolve();
      })
    });
    return p;
  }

}
