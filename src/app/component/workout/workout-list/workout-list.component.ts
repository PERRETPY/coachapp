import {Component, Input, NgZone, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {Router} from "@angular/router";
import Util from "../../../util/util";

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent implements OnInit {
  @Input()
  workoutList: Workout[];

  constructor(private router: Router,
              private zone: NgZone) { }

  ngOnInit(): void {
  }

  onWorkoutClick(workout: Workout) {
    const decodeId: string = workout.codeModule + ';' + workout.titre + ';' + workout.dateDebutPrevue;
    const encodeId: string = Util.hexEncode(decodeId);
    this.zone.run(() => {
      this.router.navigate(['/workout/'+encodeId]);
    });
  }

}
