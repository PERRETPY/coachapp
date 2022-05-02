import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuthService } from 'src/app/service/google-auth.service';
import { ProgramService } from 'src/app/service/program.service';
import { NavbarComponent } from '../navbar/navbar.component';
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
    this.createFakeWorkout();
  }

  async onSubmit() {
    this.output = "Processing submission...";
    console.log(JSON.stringify(this.model));
    await this.gauth.loadClient();
    console.log("client loaded");
    await this.gauth.loadSheetsAPI();
    console.log("sheets v4 loaded");
    this.programService.changeProgramLoaded(true);
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.model.sheetId,
      range: 'A:A'
    }).then(() => {
      localStorage.setItem("sheetId",this.model.sheetId);
      this.output = "Programme récupéré !";
      this.cd.detectChanges();
    }, (error) => {
      this.output = "Error: \n";
      this.output += error.result.error.message + "\n";
      this.cd.detectChanges();
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
