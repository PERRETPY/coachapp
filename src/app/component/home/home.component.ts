import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth.service';
import { ProgramService } from 'src/app/service/program.service';
import { SheetModel } from '../../model/sheet-model';
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

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  filterProperties: string[] = ["tous", "non commencé", "en cours", "terminé"];
  sortProperties: string[] = ["État ascendant", "État descendant", "Date ascendant", 'Date descendant'];
  stateFilter: string = 'tous';
  sortProperty: string = 'Date ascendant';
  search: string = '';

  public isSignedIn: boolean = false;
  public googleDisplay = "block";
  public model = new SheetModel();
  public output: string;
  sheetUrl: string;

  loaded: boolean = false;

  constructor(public cd: ChangeDetectorRef,
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
        this.cd.detectChanges();
        if(this.user && this.spreadSheetIsSet()) {
          this.getTraductionMap();
          this.getWorkoutList();
          this.cd.detectChanges();
        }
      }
    );
    this.authenticatorService.emitUserSubject();
  }

  onSubmit() {
    const urlArray = this.sheetUrl.split('/');
    this.model.sheetId = urlArray[5]
    this.programService.loadSheetsAPI().then(
      () => {
        this.programService.setSpreadsheets(this.model.sheetId).then(
          () => {
            if(this.spreadSheetIsSet()) {
              this.getWorkoutList();
              this.cd.detectChanges();
              location.reload();
            }
          }
        );
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
          this.onSortWorkouts();
          this.loaded = true;
          this.cd.detectChanges();
        }
        this.cd.detectChanges();
      }
    );
    this.programService.emitWorkouts();
    this.programService.getWorkouts();
  }

  getTraductionMap() {
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
      }
    );
    this.programService.emitTraduction();
    this.programService.getTraduction();
  }

  onFilterWorkouts() {
    if(this.stateFilter !== 'tous') {
      this.filterWorkoutList = this.allWorkoutList.filter(
        workout => workout.etat === this.stateFilter);
    }else {
      this.filterWorkoutList = this.allWorkoutList;
    }
    this.cd.detectChanges();
  }

  onSortWorkouts() {
    if(this.sortProperty === 'État ascendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.etat > b.etat ? 1 : a.etat === b.etat ? 0 : -1

    );
    }else if(this.sortProperty === 'État descendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.etat < b.etat ? 1 : a.etat === b.etat ? 0 : -1

    );
    }else if(this.sortProperty === 'Date ascendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.dateDebutPrevue > b.dateDebutPrevue ? 1 : a.dateDebutPrevue === b.dateDebutPrevue ? 0 : -1
      );
    }else if(this.sortProperty === 'Date descendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.dateDebutPrevue < b.dateDebutPrevue ? 1 : a.dateDebutPrevue === b.dateDebutPrevue ? 0 : -1
      );
    }
    this.cd.detectChanges();
  }

  onSearchWorkouts() {
    if(this.search === '') {
      this.filterWorkoutList = this.allWorkoutList;
      this.onFilterWorkouts();
    } else {
      this.filterWorkoutList = this.allWorkoutList;
      this.onFilterWorkouts();
      this.filterWorkoutList = this.filterWorkoutList.filter(
        workout => workout.titre.toLowerCase().includes(this.search.toLowerCase()) || workout.description.toLowerCase().includes(this.search.toLowerCase()));
    }
    this.cd.detectChanges();
  }
}
