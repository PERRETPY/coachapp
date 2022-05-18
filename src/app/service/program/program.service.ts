import {Injectable} from '@angular/core';
import {Coach} from '../../model/coach.model';
import {MetaDonnees} from '../../model/metadonnees.model';
import {Module} from '../../model/module.model';
import {Workout} from '../../model/workout.model';
import {Subject} from "rxjs";
import {GoogleAuthService} from "../google-auth/google-auth.service";

@Injectable()
export class ProgramService {

  infosCoach: Coach;
  infoCoachSubject: Subject<Coach> = new Subject<Coach>();

  infosMetaDonnees: MetaDonnees;
  infosMetaDonneesSubject: Subject<MetaDonnees> = new Subject<MetaDonnees>();

  listModules: Array<Module>;
  listModulesSubject: Subject<Module[]> = new Subject<Module[]>();

  listWorkouts: Array<Workout>;
  listWorkoutSubject: Subject<Workout[]> = new Subject<Workout[]>();

  workout: Workout;
  workoutSubject: Subject<Workout> = new Subject<Workout>();

  traductionMap: Map<string, string> = new Map();
  traductionMapSubject: Subject<Map<string, string>> = new Subject<Map<string, string>>();

  isSpreadSheetSetSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private googleAuthService: GoogleAuthService) {
    console.log('ProgramService instance created.');
    this.loadClient().then(
      () => {
        this.loadSheetsAPI().then();
      }
    );

  }



  private async loadMetaDonnees(): Promise<MetaDonnees> {
    console.log('loadMetaDonnees');
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<MetaDonnees>(
      async (resolve) => {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: localStorage.getItem('sheetId'),
          range: 'Meta-donnees!A1:D'
        });
        this.infosMetaDonnees = new MetaDonnees(response.result.values[1][0], response.result.values[1][1],
          response.result.values[1][2]);
        console.log('Call program.service > getMetaDonnes() was resolve');
        this.emitMetaDonnees();
        resolve(this.infosMetaDonnees);
      }
    );
  }

  public getMetaDonnees(): Promise<MetaDonnees> {
    console.log('Call program.service > getMetaDonnes()');
    if(this.infosMetaDonnees) {
      console.log('Call program.service > getMetaDonnes() already set');
      this.loadMetaDonnees().then();
      return new Promise<MetaDonnees>(
        resolve => resolve(this.infosMetaDonnees)
      );
    } else {
      console.log('Call program.service > getMetaDonnes() not set');
      return this.loadMetaDonnees();
    }
  }

  public emitMetaDonnees(): void {
    const infosMetaDonnees = this.infosMetaDonnees;
    this.infosMetaDonneesSubject.next(infosMetaDonnees);
  }



  private async loadListModules(): Promise<Module[]> {
    console.log('loadListModules');
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<Module[]>(
      async (resolve) => {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: localStorage.getItem('sheetId'),
          range: 'Module!A1:D'
        });
        this.listModules =  [];
        for(let i =1; i< response.result.values.length; i++){
          this.listModules.push(new Module(response.result.values[i][0],response.result.values[i][1],
            response.result.values[i][2]));
        }
        this.emitListModules();
        resolve(this.listModules);
      }
    );

  }

  public getListModules(): Promise<Module[]> {
    if(this.listModules && this.listModules.length > 0) {
      this.loadListModules();
      return new Promise<Module[]>(
        resolve => resolve(this.listModules)
      );
    } else {
      return this.loadListModules();
    }
  }

  public emitListModules(): void {
    const listModules = this.listModules;
    this.listModulesSubject.next(listModules);
  }



  private async loadTraduction(): Promise<Map<string, string>> {
    console.log('loadTraduction');
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<Map<string, string>>(
      async (resolve) => {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: localStorage.getItem('sheetId'),
          range: 'Traductions!A1:B'
        });
        this.traductionMap.clear();
        for (let i = 1; i < response.result.values.length; i++) {
          this.traductionMap.set(response.result.values[i][0], response.result.values[i][1])
        }
        this.emitTraduction();
        resolve(this.traductionMap);
      }
    );
  }

  public getTraduction(): Promise<Map<string, string>> {
    if(this.traductionMap && this.traductionMap.size > 0) {
      this.loadTraduction();
      return new Promise<Map<string, string>>(
        resolve => resolve(this.traductionMap)
      );
    } else {
      return this.loadTraduction();
    }
  }

  public emitTraduction(): void {
    const traductionMap = this.traductionMap;
    this.traductionMapSubject.next(traductionMap);
  }



  private async loadWorkouts(): Promise<Workout[]> {
    console.log('loadWorkouts');
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<Workout[]>(
      async (resolve) => {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: localStorage.getItem('sheetId'),
          range: 'Exercices!A1:N'
        });
        this.listWorkouts = [];
        for (let i = 1; i < response.result.values.length; i++) {
          const values = response.result.values[i];
          this.listWorkouts.push(new Workout(values[0], values[1], values[2],
            values[3], values[4], values[5], values[6],
            values[7], values[8], values[9],
            values[10], values[11], values[12],
            i+1, values[6] === 'non commencé' ? ProgramService.calculateLate(values[7]) : ProgramService.calculateLate(values[9])));
        }
        this.emitWorkouts();
        resolve(this.listWorkouts);
      }
    );
  }

  public getWorkouts(): Promise<Workout[]> {
    if(this.listWorkouts && this.listWorkouts.length > 0) {
      this.loadWorkouts();
      return new Promise<Workout[]>(
        resolve => resolve(this.listWorkouts)
      );
    } else {
      return this.loadWorkouts();
    }
  }

  public emitWorkouts(): void {
    const workoutList = this.listWorkouts;
    this.listWorkoutSubject.next(workoutList);
  }



  private async loadInfosCoach(): Promise<Coach> {
    console.log('loadInfosCoach');
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<Coach>(
      async (resolve) => {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: localStorage.getItem('sheetId'),
          range: 'Contact!A1:F'
        });
          this.infosCoach = new Coach(response.result.values[1][0], response.result.values[1][1],
            response.result.values[1][2], response.result.values[1][3], response.result.values[1][5]);
          this.emitInfosCoach();
          resolve(this.infosCoach);
      }
    );
  }

  public getInfosCoach(): Promise<Coach> {
    if(this.infosCoach) {
      this.loadInfosCoach();
      return new Promise<Coach>(
        resolve => resolve(this.infosCoach)
      );
    } else {
      return this.loadInfosCoach();
    }
  }

  public emitInfosCoach(): void {
    const infosCoach = this.infosCoach;
    this.infoCoachSubject.next(infosCoach);
  }



  private async loadWorkout(codeModule: String, titre: String, dateDebutPrevue: String) {
    await this.loadWorkouts();

    if(this.listWorkouts) {
      let found: boolean = false;
      let i: number = 0;
      while (!found) {
        const currentWorkout = this.listWorkouts[i];
        if(currentWorkout.codeModule === codeModule
          && currentWorkout.titre === titre
          && currentWorkout.dateDebutPrevue === dateDebutPrevue) {
          this.workout = currentWorkout;
          found = true;
        }
        i++;
      }
    }
    return new Promise<Workout>(
      (resolve, reject) => {
        if(this.workout) {
          resolve(this.workout);
        } else {
          reject();
        }
      }
    );
  }

  public getWorkoutById(codeModule: String, titre: String, dateDebutPrevue: String): Promise<Workout> {
    if(this.workout
      && this.workout.codeModule === codeModule
      && this.workout.titre === titre
      && this.workout.dateDebutPrevue === dateDebutPrevue) {
      this.loadWorkout(codeModule, titre, dateDebutPrevue);
      return new Promise<Workout>(
        resolve => resolve(this.workout)
      );
    } else {
      this.workout = null;
      return this.loadWorkout(codeModule, titre, dateDebutPrevue);
    }
  }

  public emitWorkout() {
    const workout = this.workout;
    this.workoutSubject.next(workout);
  }



  async setSpreadsheets(sheetId: string) {
    await this.loadClient();
    await this.loadSheetsAPI();

    return new Promise<void>((resolve) => {
      gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      }).then(() => {
        localStorage.setItem("sheetId", sheetId);
        this.emitSpreadSheetSet();
        resolve();
      });
    });
  }

  isSpreadSheetSet(): boolean {
    return localStorage.getItem('sheetId') && true;
  }

  emitSpreadSheetSet(): void {
    const isSpreadSheetSet = this.isSpreadSheetSet();
    this.isSpreadSheetSetSubject.next(isSpreadSheetSet);
  }



  public async loadClient() {
    return new Promise<void>((resolve) => {
      gapi.load("client:auth2", () => {
          resolve();
        },
        (error) => {
          console.log("Error loading client: "
            + JSON.stringify(error));
        });
    });
  }

  public async loadSheetsAPI() {
    return new Promise<void>((resolve) => {
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
  }

  private static calculateLate(dateCible: string): number {
    const today = new Date();
    let tabDate;
    let daysGap;

    tabDate = dateCible.split('/');

    if(tabDate.length === 3) {
      const englishDate = tabDate[1] + '/' + tabDate[0] + '/' + tabDate[2];
      const dateCible = new Date(englishDate);

      daysGap = Math.floor((today.getTime() - dateCible.getTime()) / 1000 / 60 / 60 / 24);

      if(daysGap < 0) {
        daysGap = 0;
      }

      return daysGap;
    }else {
      return 0;
    }
  }

  //--

  public getModule(code: String): Module {
    return this.listModules.find(module => {
      module.code == code
    });
  }

  public getWorkoutsByModule(codeModule: String): Array<Workout> {
    return this.listWorkouts.filter(workout => workout.codeModule === codeModule);
  }

  async putCommentOnWorkout(workout: Workout, commentaire: string): Promise<void> {
    await this.loadClient();
    await this.loadSheetsAPI();


    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: localStorage.getItem('sheetId'),
      range:'Exercices!L' + workout.range,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [commentaire]
        ]
      }
    });

    if(!this.infosCoach) {
      await this.loadInfosCoach();
    }

    return new Promise((resolve, reject) => {
      if(response.status === 200) {
        this.googleAuthService.sendEmail(this.infosCoach.mail, 'Nouveau commentaire sur l\'exercice ' + workout.titre, commentaire)
        resolve();
      } else {
        reject();
      }
    });
  }
}
