import {Component, Input, NgZone, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {Router} from "@angular/router";

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
    const encodeId: string = this.hexEncode(decodeId);
    this.zone.run(() => {
      this.router.navigate(['/workout/'+encodeId]);
    });
  }

  hexEncode(str) {
    let result = '';
    for (let i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

}
