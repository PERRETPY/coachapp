import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {HomeComponent} from "./component/home/home.component";

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
