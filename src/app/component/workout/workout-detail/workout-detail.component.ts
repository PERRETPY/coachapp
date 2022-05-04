import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program.service";

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.scss']
})
export class WorkoutDetailComponent implements OnInit {
  workoutId: string = '';

  workout: Workout;
  workoutSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private programService: ProgramService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const workoutIdEncode = this.route.snapshot.params['id'];
    this.workoutId = this.hexDecode(workoutIdEncode);

    const workoutInfo = this.workoutId.split(';');

    const codeModule = workoutInfo[0];
    const titre = workoutInfo[1];
    const dateDebutPrevue = workoutInfo[2];

    this.workoutSubscription = this.programService.workoutSubject.subscribe(
      (workout) => {
        this.workout = workout;
        this.cd.detectChanges();
      }
    );
    this.programService.emitWorkout();
    this.programService.getWorkoutById(codeModule, titre, dateDebutPrevue);
  }

  hexDecode(str1) {
    let hex  = str1.toString();
    let str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }


  onSubmitCommentaire() {
    console.log(this.workout.commentaire);
  }

  onChangeState(newState: string) {

  }
}
