import { Component, OnInit } from '@angular/core';
import {SocialUser} from "angularx-social-login";
import {Subscription} from "rxjs";
import {AuthenticatorService} from "../../service/authenticator.service";
import {Router} from "@angular/router";
import {Workout} from "../../model/workout.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  workoutList: Workout[] = [];
  sortOption: String = 'date_desc';
  stateFilterOption: String[] = [];

  user: SocialUser;
  userSubscription: Subscription;


  constructor(private authenticatorService: AuthenticatorService,
              private router: Router) { }

  ngOnInit(): void {
    this.createFakeWorkout();
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
      }
    );
    this.authenticatorService.emitUserSubject();
  }

  logOut(): void {
    this.authenticatorService.signOut();
    this.router.navigate(['/']);
  }

  onChangeSortProperty(): void {
    if(this.sortOption == 'date_desc') {
      this.workoutList.sort((a, b) => a.beginDate < b.beginDate ? -1 : a.beginDate > b.beginDate ? 1 : 0);
    }else if(this.sortOption == 'date_asc') {
      this.workoutList.sort((a, b) => a.beginDate > b.beginDate ? -1 : a.beginDate < b.beginDate ? 1 : 0);
    }else if(this.sortOption == 'state_desc') {
      this.workoutList.sort((a, b) => a.state < b.state ? -1 : a.state > b.state ? 1 : 0);
    }else if(this.sortOption == 'state_asc') {
      this.workoutList.sort((a, b) => a.state > b.state ? -1 : a.state < b.state ? 1 : 0);
    }
  }

  onFilter(): void {
    const localStateFilterOption = this.stateFilterOption;
    this.workoutList.filter(function (workout) {
      return localStateFilterOption.includes(workout.state);
    });
  }

  createFakeWorkout(): void {
    this.workoutList.push(new Workout(1, '12/05/2022', 'Entrainement 1', 'A faire', 'Entrainement des dorsaux et pectoraux'));
    this.workoutList.push(new Workout(2, '14/05/2022', 'Entrainement 2', 'A faire', 'Entrainement des jambes'));
    this.workoutList.push(new Workout(3, '01/05/2022', 'Entrainement 3', 'En cours', 'Entrainement des bras'));
    this.workoutList.push(new Workout(4, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
    this.workoutList.push(new Workout(5, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
    this.workoutList.push(new Workout(6, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
    this.workoutList.push(new Workout(7, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
    this.workoutList.push(new Workout(8, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
    this.workoutList.push(new Workout(9, '22/04/2022', 'Entrainement 4', 'Terminé', 'Entrainement des bras'));
  }

}
