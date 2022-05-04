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
}
