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

  daysLate: number;

  constructor() { }

  ngOnInit(): void {
    this.calculateLate();
  }

  calculateLate(): void {
    const today = new Date();
    let tabDate;
    let daysGap;
    if(this.workout.etat === 'non commencé') {
      tabDate = this.workout.dateDebutPrevue.split('/');

    }else if(this.workout.etat === 'en cours') {
      tabDate = this.workout.dateFinPrevue.split('/');
    }else {
      return;
    }

    if(tabDate.length === 3) {
      const englishDate = tabDate[1] + '/' + tabDate[0] + '/' + tabDate[2];
      const dateCible = new Date(englishDate);

      daysGap = Math.floor((today.getTime() - dateCible.getTime()) / 1000 / 60 / 60 / 24);

      if(daysGap < 0) {
        daysGap = 0;
      }

      this.daysLate = daysGap;
    }
  }

}
