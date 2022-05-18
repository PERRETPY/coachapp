import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Coach } from 'src/app/model/coach.model';
import { MetaDonnees } from 'src/app/model/metadonnees.model';
import { ProgramService } from 'src/app/service/program.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  infosCoach: Coach;
  infosCoachSubscription: Subscription = new Subscription();

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  metadonnees: MetaDonnees
  private loaded: boolean = false;

  constructor(private programService: ProgramService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getInfoCoach();
    //this.getTraductionMap();
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

  getInfoCoach() {
    this.infosCoachSubscription = this.programService.infoCoachSubject.subscribe(
      (infosCoach) => {
        this.infosCoach = infosCoach;
        this.cd.detectChanges();
      }
    );

    this.programService.getInfosCoach().then(
      (infosCoach) => {
        this.infosCoach = infosCoach;
        this.loaded = true;
        this.cd.detectChanges();
      }).catch();
  }

  ngOnDestroy(): void {
    if(this.traductionMapSubscription) {
      this.traductionMapSubscription.unsubscribe()
    }
    if(this.infosCoachSubscription) {
      this.infosCoachSubscription.unsubscribe();
    }
  }

}
