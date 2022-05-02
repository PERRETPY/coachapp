import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import {LoginComponent} from "./component/login/login.component";
//import {AuthGuardService} from "./service/auth-guard.service";
import {HomeComponent} from "./component/home/home.component";
import {ContactComponent} from "./component/contact/contact.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  //{ path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
