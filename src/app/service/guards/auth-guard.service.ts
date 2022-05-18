import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {GoogleAuthService} from "../google-auth/google-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private googleAuthService: GoogleAuthService,
              private router: Router) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any {

    if (this.googleAuthService.googleUser != null){
      return true;
    }else{
      this.router.navigate(['/']).then();
    }

  }
}
