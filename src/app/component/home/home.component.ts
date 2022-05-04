import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth.service';
import { ProgramService } from 'src/app/service/program.service';
import { SheetModel } from './sheet-model';
import {Workout} from "../../model/workout.model";
import {Subscription} from "rxjs";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  workoutList: Workout[] = [];
  workoutSubscription: Subscription;

  public isSignedIn: boolean = false;
  public googleDisplay = "block";
  public model = new SheetModel();
  public output: string;

  loaded: boolean = false;

  constructor(private cd: ChangeDetectorRef,
    public gauth: GoogleAuthService,
    public programService: ProgramService) {
    this.output = "Renseigner l'id du google sheet puis appuyer sur Envoyer. ";
  }

  ngOnInit() {
    this.workoutSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.workoutList = workoutList;
        if(this.workoutList) {
          this.loaded = true;
          this.cd.detectChanges();
        }
      }
    );
    this.programService.emitWorkouts();
    this.programService.getWorkouts().then();
  }

  onSubmit() {
    this.programService.setSpreadsheets(this.model.sheetId).then();
  }

  getWorkoutList() {

  }

}
