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
import {AuthenticatorService} from "./service/authenticator.service";
import { LoginComponent } from './component/login/login.component';
import { HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ContactComponent } from './component/contact/contact.component';
import { WorkoutListComponent } from './component/workout/workout-list/workout-list.component';
import { WorkoutPreviewComponent } from './component/workout/workout-preview/workout-preview.component';
import { WorkoutDetailComponent } from './component/workout/workout-detail/workout-detail.component';
import { ProgramService } from './service/program.service';
import { JsLoaderService } from './service/js-loader.service';
import { GoogleAuthService } from './service/google-auth.service';
import { NavigationBarComponent } from './component/navigation-bar/navigation-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ContactComponent,
    WorkoutListComponent,
    WorkoutPreviewComponent,
    WorkoutDetailComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
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
    AuthenticatorService,
    ProgramService,
    JsLoaderService,
    //GoogleAuthService,
    SocialAuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
