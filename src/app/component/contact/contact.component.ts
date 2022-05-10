import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Coach } from 'src/app/model/coach.model';
import { MetaDonnees } from 'src/app/model/metadonnees.model';
import { ProgramService } from 'src/app/service/program.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  infosCoach: Coach;
  infosCoachSubscription: Subscription = new Subscription();

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  metadonnees: MetaDonnees
  programService: ProgramService;
  private loaded: boolean = false;

  constructor(programService: ProgramService, private cd: ChangeDetectorRef) {
    this.programService = programService;
   }

  ngOnInit(): void {
    this.getTraductionMap();
    this.infosCoachSubscription = this.programService.infoCoachSubject.subscribe(
      (infosCoach) => {
        this.infosCoach = infosCoach;
        if(this.infosCoach) {
          console.log("INFO COACH : ");
          console.log(this.infosCoach);
          this.loaded = true;
          this.cd.detectChanges();
        }
      }
    );
    this.programService.emitWorkouts();
    this.programService.getInfosCoach().then();
  }

  getTraductionMap() {
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
      }
    );
    this.programService.emitTraduction();
    this.programService.getTraduction();
  }

}
