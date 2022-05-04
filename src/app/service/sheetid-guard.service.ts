import { Injectable } from '@angular/core';
import {AuthenticatorService} from "./authenticator.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SheetidGuardService {

  constructor(private router: Router) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any {

    if (localStorage.getItem('sheetId') != null){
      return true;
    }else{
      this.router.navigate(['/']).then();
    }

  }
}
