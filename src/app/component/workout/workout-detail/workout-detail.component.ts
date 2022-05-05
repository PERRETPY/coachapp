import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program.service";
import Util from "../../../util/util";
import {AuthenticatorService} from "../../../service/authenticator.service";
import {Coach} from "../../../model/coach.model";

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.scss']
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
              private authenticatorService: AuthenticatorService) { }

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
        if(this.workout) {
          this.commentaire = this.workout.commentaire.toString();
        }
        this.cd.detectChanges();
      }
    );
    this.programService.emitWorkout();
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
      //MAJ du Workout

      //Send notification to the coach
      this.authenticatorService.sendEmail(this.coachInfo.mail.toString(), 'Nouveau commentaire sur l\'exercice'+this.workout.titre, this.workout.description.toString());
    }
    console.log(this.workout.commentaire);
    //this.authenticatorService.sendEmail();
  }

  onChangeState(newState: string) {

  }
}
