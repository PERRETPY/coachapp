import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program.service";
import Util from "../../../util/util";
import {AuthenticatorService} from "../../../service/authenticator.service";
import {Coach} from "../../../model/coach.model";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.scss'],
  providers: [DatePipe]
})
export class WorkoutDetailComponent implements OnInit {
  workoutId: string = '';

  commentaire: string = '';

  workout: Workout;
  workoutSubscription: Subscription = new Subscription();

  coachInfo: Coach;
  coachInfoSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private programService: ProgramService,
              private cd: ChangeDetectorRef,
              private authenticatorService: AuthenticatorService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    const workoutIdEncode = this.route.snapshot.params['id'];
    this.workoutId = Util.hexDecode(workoutIdEncode);

    const workoutInfo = this.workoutId.split(';');

    const codeModule = workoutInfo[0];
    const titre = workoutInfo[1];
    const dateDebutPrevue = workoutInfo[2];

    this.workoutSubscription = this.programService.workoutSubject.subscribe(
      (workout) => {
        this.workout = workout;
        if(this.workout && this.workout.commentaire) {
          this.commentaire = this.workout.commentaire.toString();
        }
        this.cd.detectChanges();
      }
    );
    this.programService.getWorkoutById(codeModule, titre, dateDebutPrevue);

    this.coachInfoSubscription = this.programService.infoCoachSubject.subscribe(
      (coachInfo) => {
        this.coachInfo = coachInfo;
      }
    );
    this.programService.emitInfosCoach();
    this.programService.getInfosCoach().then();
  }


  onSubmitCommentaire() {
    //Vérification que le commentaire a changé
    if(this.commentaire !== this.workout.commentaire) {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!L' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [this.commentaire]
          ]
        }
      }).then(
        () => {
          this.cd.detectChanges();
          this.workout.commentaire = this.commentaire;
        });

      //Send notification to the coach
      this.authenticatorService.sendEmail(this.coachInfo.mail.toString(), 'Nouveau commentaire sur l\'exercice '+this.workout.titre, this.workout.commentaire.toString());
    }

    //this.authenticatorService.sendEmail();
  }

  onChangeState(newState: string) {
    const date = new Date();
    const dateToString = this.datePipe.transform(date,"dd/MM/yyyy");
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: localStorage.getItem('sheetId'),
      range:'Exercices!G' + this.workout.range,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [newState]
        ]
      }
    }).then(this.cd.detectChanges());
    if(newState == "en cours") {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!I' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [dateToString]
          ]
        }
      }).then(this.cd.detectChanges());
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!K' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [""]
          ]
        }
      }).then(this.cd.detectChanges());
    }
    if(newState == "terminé") {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!K' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [dateToString]
          ]
        }
      }).then(this.cd.detectChanges());
    }
    this.ngOnInit();
  }
}
