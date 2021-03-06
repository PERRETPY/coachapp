import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Module} from "../../model/module.model";
import {Subscription} from "rxjs";
import {ProgramService} from "../../service/program/program.service";
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
    this.getListModules();
  }

  getWorkoutList() {
    this.listWorkouts = [];

    this.listWorkoutsSubscription = this.programService.listWorkoutSubject.subscribe(
      (workoutList) => {
        this.listWorkouts = workoutList;
        this.addWorkoutsToModules();
        this.setListChallenge();
        this.cd.detectChanges();
      }
    );

    this.programService.getWorkouts().then(
      (workoutList) => {
        this.listWorkouts = workoutList;
        this.addWorkoutsToModules();
        this.setListChallenge();
        this.cd.detectChanges();
      }).catch();

  }

  getListModules() {
    this.listModulesSubscription = this.programService.listModulesSubject.subscribe(
      (listModules) => {
        this.listModules = listModules;
        this.getWorkoutList();
        this.cd.detectChanges();
      }
    );

    this.programService.getListModules().then(
      (listModules) => {
        this.listModules = listModules;
        this.getWorkoutList();
        this.cd.detectChanges();
      }).catch();
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
        if(workout.etat == 'termin??') {
          nbDone += 1;
        }
      }
    );

    return Math.round(nbDone / workoutList.length * 100);
  }

  private setListChallenge() {
    this.listChallenge = this.listWorkouts.filter(
      workout => workout.type === 'D??fi'
    );
    this.listChallenge.sort(
      (a, b) => a.etat < b.etat ? 1 : a.etat === b.etat ? 0 : -1
    );
  }

  onChallengeClick(challenge: Workout) {
    const str: string = challenge.codeModule + ';' + challenge.titre + ';' + challenge.dateDebutPrevue;
    const encode: string = Util.hexEncode(str);

    this.zone.run(() => {
      this.router.navigate(['/workout/'+encode]);
    });
  }

  ngOnDestroy(): void {
    console.log('on Destroy');

    if(this.listWorkoutsSubscription) {
      this.listWorkoutsSubscription.unsubscribe();
    }
    if(this.listModulesSubscription) {
      this.listModulesSubscription.unsubscribe();
    }
  }
}
