import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {HomeComponent} from "./component/home/home.component";
import {ContactComponent} from "./component/contact/contact.component";
import {WorkoutDetailComponent} from "./component/workout/workout-detail/workout-detail.component";
import {SheetidGuardService} from "./service/sheetid-guard.service";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuardService, SheetidGuardService] },
  { path: 'workout/:id', component: WorkoutDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
