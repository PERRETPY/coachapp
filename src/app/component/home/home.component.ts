import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth.service';
import { ProgramService } from 'src/app/service/program.service';
import { SheetModel } from './sheet-model';
import {Workout} from "../../model/workout.model";
import {Subscription} from "rxjs";
import {SocialUser} from "angularx-social-login";
import {AuthenticatorService} from "../../service/authenticator.service";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allWorkoutList: Workout[] = [];
  workoutSubscription: Subscription;

  filterWorkoutList: Workout[] = [];

  user: SocialUser;
  userSubscription: Subscription;

  filterProperties: string[] = ["tous", "non commencé", "En cours", "terminé"];
  stateFilter: string = 'tous';

  public isSignedIn: boolean = false;
  public googleDisplay = "block";
  public model = new SheetModel();
  public output: string;

  loaded: boolean = false;

  constructor(private cd: ChangeDetectorRef,
              public gauth: GoogleAuthService,
              public programService: ProgramService,
              private authenticatorService: AuthenticatorService) {
    this.output = "Renseigner l'id du google sheet puis appuyer sur Envoyer. ";
  }

  ngOnInit() {
    this.allWorkoutList = [];
    this.filterWorkoutList = [];
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
        if(this.user && this.spreadSheetIsSet()) {
          this.getWorkoutList();
        }
      }
    );
    this.authenticatorService.emitUserSubject();
  }

  onSubmit() {
    this.programService.setSpreadsheets(this.model.sheetId).then(
      () => {
        this.getWorkoutList();
        this.cd.detectChanges();
      }
    );
  }

  spreadSheetIsSet(): boolean {
    return localStorage.getItem('sheetId') && true;
  }

  getWorkoutList() {
    this.allWorkoutList = [];
    this.filterWorkoutList = [];
    this.workoutSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.allWorkoutList = workoutList;
        if(this.allWorkoutList) {
          this.filterWorkoutList = this.allWorkoutList;
          this.loaded = true;
          this.cd.detectChanges();
        }
        this.cd.detectChanges();
      }
    );
    this.programService.emitWorkouts();
    this.programService.getWorkouts();
  }

  onFilterWorkouts() {
    if(this.stateFilter !== 'tous') {
      this.filterWorkoutList = this.allWorkoutList.filter(
        workout => workout.etat === this.stateFilter);
    }else {
      this.filterWorkoutList = this.allWorkoutList;
    }
  }

  onSortWorkouts(sortProperty: string, sortDirection: string) {
    if(sortProperty === 'etat') {
      if(sortDirection === 'asc') {
        this.filterWorkoutList = this.filterWorkoutList.sort(
          (a, b) => a.etat > b.etat ? 1 : -1
        );
      }else if(sortDirection === 'desc') {
        this.filterWorkoutList = this.filterWorkoutList.sort(
          (a, b) => a.etat > b.etat ? -1 : 1
        );
      }
    }else if(sortProperty === 'dateDebutReelle') {
      if(sortDirection === 'asc') {
        this.filterWorkoutList = this.filterWorkoutList.sort(
          (a, b) => a.dateDebutReelle > b.dateDebutReelle ? 1 : -1
        );
      }else if(sortDirection === 'desc') {
        this.filterWorkoutList = this.filterWorkoutList.sort(
          (a, b) => a.dateDebutReelle > b.dateDebutReelle ? -1 : 1
        );
      }
    }
  }

  onSearchWorkouts(search: string) {
    this.filterWorkoutList = this.filterWorkoutList.filter(
      workout => workout.titre.includes(search) || workout.description.includes(search));
  }

}
