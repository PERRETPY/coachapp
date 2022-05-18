import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {ProgramService} from "../program/program.service";

@Injectable({
  providedIn: 'root'
})
export class SheetidGuardService {

  constructor(private router: Router,
              private programService: ProgramService) {
  }


  canActivate(): any {
    if (this.programService.isSpreadSheetSet()){
      return true;
    }else{
      this.router.navigate(['/']).then();
    }
  }
}
