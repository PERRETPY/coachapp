import {Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";

@Component({
  selector: 'app-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss']
})
export class WorkoutPreviewComponent implements OnInit {
  @Input()
  workout: Workout;

  @Input()
  traductionMap: Map<string, string>;

  constructor() { }

  ngOnInit(): void { }

}
