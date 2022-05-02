import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  coachName: string;
  coachImage: string;
  coachWebsite: string;
  coachMail: string;
  description: string;

  constructor(private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: localStorage.getItem('sheetId'),
      range: 'Contact!A1:F'
    }).then((response) => {
      this.coachName = response.result.values[1][0];
      this.description = response.result.values[1][1];
      this.coachImage = response.result.values[1][2];
      this.coachWebsite = response.result.values[1][3];
      this.cd.detectChanges();
    }, (error) => {
      this.cd.detectChanges();
    });
  }

}
