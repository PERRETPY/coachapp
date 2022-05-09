import { Injectable } from '@angular/core';
import {AuthenticatorService} from "./authenticator.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authenticatorService: AuthenticatorService,
              private router: Router) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any {

    if (this.authenticatorService.user != null){
      return true;
    }else{
      this.router.navigate(['/']).then();
    }

  }
}
