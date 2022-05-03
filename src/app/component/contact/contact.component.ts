import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Coach } from 'src/app/model/coach.model';
import { MetaDonnees } from 'src/app/model/metadonnees.model';
import { ProgramService } from 'src/app/service/program.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  coachInfos: Coach;
  metadonnees: MetaDonnees
  programService: ProgramService;

  constructor(programService: ProgramService) {
    this.programService = programService;
   }

  ngOnInit(): void {
    this.coachInfos = this.programService.getInfosCoach();
  }

}
