import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialAuthServiceConfig,
  SocialLoginModule
} from "angularx-social-login";
import { HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ContactComponent } from './component/contact/contact.component';
import { WorkoutListComponent } from './component/workout/workout-list/workout-list.component';
import { WorkoutPreviewComponent } from './component/workout/workout-preview/workout-preview.component';
import { WorkoutDetailComponent } from './component/workout/workout-detail/workout-detail.component';
import { ProgramService } from './service/program/program.service';
import { JsLoaderService } from './service/program/js-loader.service';
import { NavigationBarComponent } from './component/navigation-bar/navigation-bar.component';
import { TrophyComponent } from './component/trophy/trophy.component';
import { ToastContainerComponent } from './component/toast-container/toast-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";
import {GoogleAuthService} from "./service/google-auth/google-auth.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactComponent,
    WorkoutListComponent,
    WorkoutPreviewComponent,
    WorkoutDetailComponent,
    NavigationBarComponent,
    TrophyComponent,
    ToastContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '928647304585-lj9tt27rvps4r29jsudhsq7qqkcliq9m.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    ProgramService,
    JsLoaderService,
    GoogleAuthService,
    SocialAuthService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
