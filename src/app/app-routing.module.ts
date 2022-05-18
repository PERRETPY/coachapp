import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./component/home/home.component";
import { ContactComponent } from "./component/contact/contact.component";
import { WorkoutDetailComponent } from "./component/workout/workout-detail/workout-detail.component";
import { TrophyComponent } from "./component/trophy/trophy.component";
import {SheetidGuardService} from "./service/guards/sheetid-guard.service";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent, canActivate: [SheetidGuardService] },
  { path: 'workout/:id', component: WorkoutDetailComponent, canActivate: [SheetidGuardService] },
  { path: 'trophy', component: TrophyComponent, canActivate: [SheetidGuardService]},
  { path: '*', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
