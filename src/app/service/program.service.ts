import {Injectable } from '@angular/core';
import { Coach } from '../model/coach.model';
import { MetaDonnees } from '../model/metadonnees.model';
import { Module } from '../model/module.model';
import { Workout } from '../model/workout.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  public infosCoach: Coach;
  public infosMetaDonnees: MetaDonnees;
  public listModules: Array<Module>;
  public listWorkouts: Array<Workout>;
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
    this.listModules =  new Array();
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

  public loadWorkouts() {
    this.listWorkouts = new Array();
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Exercices!A1:N'
    }).then((response) => {
      for(let i =1; i< response.result.values.length; i++){
        this.listWorkouts.push(new Workout(response.result.values[i][0], response.result.values[i][1], response.result.values[i][2], 
          response.result.values[i][3], response.result.values[i][4], response.result.values[i][5], response.result.values[i][6], 
          response.result.values[i][7], response.result.values[i][8], response.result.values[i][9], 
          response.result.values[i][10], response.result.values[i][11], response.result.values[i][12]));
      }     
    }, (error) => {
      console.log('Erreur :' + error);
    });
    console.log(this.listWorkouts);
  }

  public loadInfosCoach () {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Contact!A1:F'
    }).then((response) => {
      this.infosCoach = new Coach (response.result.values[1][0],response.result.values[1][1],
        response.result.values[1][2], response.result.values[1][3], response.result.values[1][5]);
    }, (error) => {
      console.log('Erreur :' + error);
    });
  }

  public getMetaDonnees(): MetaDonnees {
    return this.infosMetaDonnees;
  }

  public getInfosCoach(): Coach {
    return this.infosCoach;
  }

  public getListModules(): Array<Module> {
    return this.listModules;
  }

  public getModule(code: String): Module {
    return this.listModules.find(module => {
      module.code == code
    });
  }

  public getWorkouts(): Array<Workout> {
    return this.listWorkouts;
  }

  public getWorkoutsByModule(codeModule: String): Array<Workout> {
    return this.listWorkouts.filter(workout => workout.codeModule === codeModule);
  }

  public getWorkoutById(codeModule: String, titre: String, dateDebutPrevue: String): Workout {
    return this.listWorkouts.find(workout => {
      workout.codeModule === codeModule && workout.titre === titre && workout.dateDebutPrevue === dateDebutPrevue; 
    });
  }
}
