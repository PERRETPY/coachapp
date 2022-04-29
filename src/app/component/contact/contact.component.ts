import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  coachName: string = "Tibo le + bo";
  coachImage: string = "https://voi.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fvoi.2F2021.2F11.2F05.2Fc511a613-dc6a-4a66-9a2b-b1971f4d8648.2Ejpeg/400x400/quality/80/focus-point/241%2C251/tibo-inshape.jpg";
  coachWebsite: string = "https://www.github.com/perretpy";
  coachMail: string = "tibo@gmail.com";
  description: string = "Je suis fort et je possède une super chaine youtube avec beaucoup d'abonnée. Venez liker SVPJe suis fort et je possède une super chaine youtube avec beaucoup d'abonnée. Venez liker SVP Je suis fort et je possède une super chaine youtube avec beaucoup d'abonnée. Venez liker SVP Je suis fort et je possède une super chaine youtube avec beaucoup d'abonnée. Venez liker SVP"

  constructor() { }

  ngOnInit(): void {
  }

}
