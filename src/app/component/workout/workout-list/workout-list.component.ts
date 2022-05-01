import {Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.scss']
})
export class WorkoutListComponent implements OnInit {
  @Input()
  workoutList: Workout[];

  constructor() { }

  ngOnInit(): void {
  }

}
