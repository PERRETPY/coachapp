import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth/google-auth.service';
import { ProgramService } from 'src/app/service/program/program.service';
import { SheetModel } from '../../model/sheet-model';
import { Workout } from "../../model/workout.model";
import { Subscription} from "rxjs";
import { SocialUser } from "angularx-social-login";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  allWorkoutList: Workout[] = [];
  workoutSubscription: Subscription;

  isSpreadSheetSetSubscription: Subscription;
  isSpreadSheetSet: boolean;

  filterWorkoutList: Workout[] = [];

  user: SocialUser;
  userSubscription: Subscription;

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  filterProperties: string[] = ["tous", "non commencé", "en cours", "terminé"];
  sortProperties: string[] = ["État ascendant", "État descendant", "Date ascendant", 'Date descendant', 'Retard descendant', "Retard ascendant"];
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
              private googleAuthService: GoogleAuthService) {
    this.output = "Renseigner l'id du google sheet puis appuyer sur Envoyer. ";
  }

  ngOnInit() {
    console.log('Home component');
    this.userSubscription = this.googleAuthService.googleUserSubject.subscribe(
      (user: any) => {
        console.log('UserSubscribe');
        this.user = user;
        this.loadData();
        this.cd.detectChanges();
      }
    );
    this.googleAuthService.emitGoogleUser();

    this.isSpreadSheetSetSubscription = this.programService.isSpreadSheetSetSubject.subscribe(
      (isSpreadSheetSet) => {
        console.log('SpreadSheetSubscribe');
        this.isSpreadSheetSet = isSpreadSheetSet;
        this.loadData();
        this.cd.detectChanges();
      }
    );
    this.programService.emitSpreadSheetSet();

    this.loadData();
  }

  loadData() {
    if(this.user && this.isSpreadSheetSet) {
      if(!this.traductionMap || this.traductionMap.size < 1) {
        this.getTraductionMap();
      }
      if(!this.allWorkoutList || this.allWorkoutList.length < 1) {
        this.getWorkoutList();
      }
    }
  }

  getWorkoutList() {
    this.allWorkoutList = [];
    this.filterWorkoutList = [];

    this.workoutSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.allWorkoutList = workoutList;
        this.filterWorkoutList = this.allWorkoutList;
        this.cd.detectChanges();
      }
    );

    this.programService.getWorkouts().then(
      (workoutList) => {
        this.allWorkoutList = workoutList;
        this.filterWorkoutList = this.allWorkoutList;
        this.programService.emitSpreadSheetSet();
        this.loaded = true;
        this.cd.detectChanges();
      }).catch();
  }

  getTraductionMap() {
    console.log('get traduction')
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
        this.cd.detectChanges();
      }
    );

    this.programService.getTraduction().then(
      (traductionMap) => {
        console.log('loadTraduction from home component');
        this.traductionMap = traductionMap;
        this.loaded = true;
        this.cd.detectChanges();
      }).catch();
  }

  onSubmit() {
    const urlArray = this.sheetUrl.split('/');
    this.model.sheetId = urlArray[5]
    this.programService.loadSheetsAPI().then(
      () => {
        this.programService.setSpreadsheets(this.model.sheetId).then(
          () => {
            if(this.programService.isSpreadSheetSet()) {
              this.getTraductionMap();
              this.getWorkoutList();
              this.cd.detectChanges();
              //location.reload();
            }
          }
        );
      }
    );
  }

  //--

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
    }else if(this.sortProperty === 'Retard descendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.daysLate < b.daysLate ? 1 : a.daysLate === b.daysLate ? 0 : -1
      );
    }else if(this.sortProperty === 'Retard ascendant') {
      this.filterWorkoutList.sort(
        (a, b) => a.daysLate > b.daysLate ? 1 : a.daysLate === b.daysLate ? 0 : -1
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

  ngOnDestroy(): void {
    console.log('on Destroy');

    if(this.traductionMapSubscription) {
      this.traductionMapSubscription.unsubscribe();
    }
    if(this.isSpreadSheetSetSubscription) {
      this.isSpreadSheetSetSubscription.unsubscribe();
    }
    if(this.workoutSubscription) {
      this.workoutSubscription.unsubscribe();
    }
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
