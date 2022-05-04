import {Injectable } from '@angular/core';
import { Coach } from '../model/coach.model';
import { MetaDonnees } from '../model/metadonnees.model';
import { Module } from '../model/module.model';
import { Workout } from '../model/workout.model';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  public infosCoach: Coach;
  infoCoachSubject: Subject<Coach> = new Subject<Coach>();

  public infosMetaDonnees: MetaDonnees;
  public listModules: Array<Module>;

  listWorkouts: Array<Workout>;
  listWorkoutSubject: Subject<Workout[]> = new Subject<Workout[]>();

  constructor() { }

  public loadMetaDonnees() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Meta-donnees!A1:D'
    }).then((response) => {
      this.infosMetaDonnees = new MetaDonnees (response.result.values[1][0],response.result.values[1][1],
        response.result.values[1][2]);
    }, (error) => {
      console.log('Erreur :' + error);
    });
  }

  public loadListModules () {
    this.listModules =  [];
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Module!A1:D'
    }).then((response) => {
      for(let i =1; i< response.result.values.length; i++){
        this.listModules.push(new Module(response.result.values[i][0],response.result.values[i][1],
          response.result.values[i][2]));
      }
    }, (error) => {
      console.log('Erreur :' + error);
    });
    console.log(this.listModules);
  }

  public async getWorkouts() {
    console.log('get call');

    await this.loadClient();
    await this.loadSheetsAPI();

    this.listWorkouts = [];
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Exercices!A1:N'
    }).then((response) => {
      for (let i = 1; i < response.result.values.length; i++) {
        this.listWorkouts.push(new Workout(response.result.values[i][0], response.result.values[i][1], response.result.values[i][2],
          response.result.values[i][3], response.result.values[i][4], response.result.values[i][5], response.result.values[i][6],
          response.result.values[i][7], response.result.values[i][8], response.result.values[i][9],
          response.result.values[i][10], response.result.values[i][11], response.result.values[i][12]));
      }
      this.emitWorkouts();
    }, (error) => {
      console.log('Erreur :' + error);
    });
    console.log(this.listWorkouts);
  }

  public emitWorkouts(): void {
    const workoutList = this.listWorkouts;
    this.listWorkoutSubject.next(workoutList);
  }

  public async getInfosCoach() {
    await this.loadClient();
    await this.loadSheetsAPI();

    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Contact!A1:F'
    }).then((response) => {
      this.infosCoach = new Coach(response.result.values[1][0], response.result.values[1][1],
        response.result.values[1][2], response.result.values[1][3], response.result.values[1][5]);
      this.emitInfosCoach();
    }, (error) => {
      console.log('Erreur :' + error);
    });
  }

  public emitInfosCoach(): void {
    const infosCoach = this.infosCoach;
    this.infoCoachSubject.next(infosCoach);
  }

  public getMetaDonnees(): MetaDonnees {
    return this.infosMetaDonnees;
  }

  public getListModules(): Array<Module> {
    return this.listModules;
  }

  public getModule(code: String): Module {
    return this.listModules.find(module => {
      module.code == code
    });
  }

  public getWorkoutsByModule(codeModule: String): Array<Workout> {
    return this.listWorkouts.filter(workout => workout.codeModule === codeModule);
  }

  public getWorkoutById(codeModule: String, titre: String, dateDebutPrevue: String): Workout {
    return this.listWorkouts.find(workout => {
      workout.codeModule === codeModule && workout.titre === titre && workout.dateDebutPrevue === dateDebutPrevue;
    });
  }

  async setSpreadsheets(sheetId: string) {
    await this.loadClient();
    await this.loadSheetsAPI();

    gapi.client.sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    }).then(() => {
      localStorage.setItem("sheetId", sheetId);
    });
    console.log('SpreadSheet set');
  }

  public async loadClient() {
    let p = new Promise<void>((resolve) => {
      gapi.load("client:auth2", () => {
          resolve();
        },
        (error) => {
          console.log("Error loading client: "
            + JSON.stringify(error));
        });
    });
    return p;
  }

  public async loadSheetsAPI() {
    let p = new Promise<void>((resolve) => {
      gapi.client.load(
        'https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            resolve();
          },
          (error) => {
            console.log("Error loading SheetsAPI: "
              + JSON.stringify(error));
          });
    });
    return p;
  }
}
