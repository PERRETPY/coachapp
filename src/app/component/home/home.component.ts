import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth.service';
import { ProgramService } from 'src/app/service/program.service';
import { SheetModel } from './sheet-model';
import {Workout} from "../../model/workout.model";

declare global {
  interface Window { onSignIn: (googleuser: any) => void; }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public workoutList: Workout[] = [];
  public isSignedIn: boolean = false;
  public googleDisplay = "block";
  public model = new SheetModel();
  public output: string;

  constructor(private cd: ChangeDetectorRef,
    public gauth: GoogleAuthService,
    public programService: ProgramService) {
    this.output = "Renseigner l'id du google sheet puis appuyer sur Envoyer. ";
  }

  ngOnInit() {
  }

  async onSubmit() {
    this.output = "Processing submission...";
    console.log(JSON.stringify(this.model));
    await this.gauth.loadClient();
    await this.gauth.loadSheetsAPI();
    console.log("sheets v4 loaded");
    gapi.client.sheets.spreadsheets.get({
      spreadsheetId: this.model.sheetId,
    }).then(() => {
      localStorage.setItem("sheetId",this.model.sheetId);
      this.output = "Programme récupéré !";
      this.cd.detectChanges();
    }, (error) => {
      this.output = "Error: \n";
      this.output += error.result.error.message + "\n";
      this.cd.detectChanges();
    });
    this.programService.loadInfosCoach();
    this.programService.loadListModules();
    this.programService.loadWorkouts();
    this.programService.loadMetaDonnees();
  }

}
