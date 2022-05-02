import {Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.scss']
})
export class WorkoutDetailComponent implements OnInit {
  workoutId: number = 0;
  workout: Workout;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.params['id'] != null) {
      this.workoutId = this.route.snapshot.params['id'];
      //Get workout from service
      this.workout = new Workout(1, '12/05/2022', 'Entrainement 1', 'A faire', 'Entrainement des dorsaux et pectoraux');
    }
  }


}
