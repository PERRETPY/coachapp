import {Component, Input, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program.service";

@Component({
  selector: 'app-workout-preview',
  templateUrl: './workout-preview.component.html',
  styleUrls: ['./workout-preview.component.scss']
})
export class WorkoutPreviewComponent implements OnInit {
  @Input()
  workout: Workout;

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  constructor(private programService: ProgramService) { }

  ngOnInit(): void {
    this.getTraductionMap();
  }

  getTraductionMap() {
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
      }
    );
    this.programService.emitTraduction();
    this.programService.getTraduction();
    //
  }

}
