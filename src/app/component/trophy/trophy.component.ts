import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Module} from "../../model/module.model";
import {Subscription} from "rxjs";
import {ProgramService} from "../../service/program.service";
import {Workout} from "../../model/workout.model";

@Component({
  selector: 'app-trophy',
  templateUrl: './trophy.component.html',
  styleUrls: ['./trophy.component.scss']
})
export class TrophyComponent implements OnInit {
  listModules: Module[];
  listModulesSubscription: Subscription = new Subscription();

  listWorkouts: Workout[];
  listWorkoutsSubscription: Subscription = new Subscription();

  constructor(private programService: ProgramService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listModulesSubscription = this.programService.listModulesSubject.subscribe(
      (listModules) => {
        this.listModules = listModules;
        this.cd.detectChanges();
        if(this.listModules) {
          this.getListWorkouts();
        }
      }
    );
    this.programService.emitListModules();
    this.programService.getListModules();
  }

  private getListWorkouts() {
    console.log('getWOrkouts');
    this.listWorkoutsSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.listWorkouts = workoutList;
        if(this.listWorkouts) {
          this.addWorkoutsToModules();
        }
      }
    );
    this.programService.emitWorkouts();
    this.programService.getWorkouts();
  }

  addWorkoutsToModules() {
    console.log('add');
    this.listModules.forEach(
      (module) => {
        const workoutList = this.listWorkouts.filter(
          workout => workout.codeModule === module.code
        );
        module.workoutList = workoutList;
      }
    );
    this.cd.detectChanges();
    console.log(this.listModules)
  }
}
