import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Module} from "../../model/module.model";
import {Subscription} from "rxjs";
import {ProgramService} from "../../service/program.service";
import {Workout} from "../../model/workout.model";
import Util from '../../util/util';
import {Router} from "@angular/router";

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

  listChallenge: Workout[];

  constructor(private programService: ProgramService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private zone: NgZone) { }

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
    this.listWorkoutsSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.listWorkouts = workoutList;
        if(this.listWorkouts) {
          this.setListChallenge();
          this.addWorkoutsToModules();
        }
      }
    );
    this.programService.emitWorkouts();
    this.programService.getWorkouts();
  }

  addWorkoutsToModules() {
    this.listModules.forEach(
      (module) => {
        const workoutList = this.listWorkouts.filter(
          workout => workout.codeModule === module.code
        );
        module.workoutList = workoutList;
        module.avancement = this.calculateAchivement(workoutList);
      }
    );
    this.cd.detectChanges();
  }

  calculateAchivement(workoutList: Workout[]): number {
    let nbDone = 0;
    workoutList.forEach(
      (workout) => {
        if(workout.etat == 'terminé') {
          nbDone += 1;
        }
      }
    );

    return Math.round(nbDone / workoutList.length * 100);
  }

  private setListChallenge() {
    this.listChallenge = this.listWorkouts.filter(
      workout => workout.type === 'Défi'
    )
  }

  onChallengeClick(challenge: Workout) {
    const str: string = challenge.codeModule + ';' + challenge.titre + ';' + challenge.dateDebutPrevue;
    const encode: string = Util.hexEncode(str);

    this.zone.run(() => {
      this.router.navigate(['/workout/'+encode]);
    });
  }
}
