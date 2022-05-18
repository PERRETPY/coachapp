import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program.service";
import Util from "../../../util/util";
import {AuthenticatorService} from "../../../service/authenticator.service";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.scss'],
  providers: [DatePipe]
})
export class WorkoutDetailComponent implements OnInit {
  workoutId: string = '';

  commentaire: string = '';

  workout: Workout;
  workoutSubscription: Subscription = new Subscription();

  traductionMap: Map<string, string> = new Map<string, string>();
  traductionMapSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private programService: ProgramService,
              private cd: ChangeDetectorRef,
              private authenticatorService: AuthenticatorService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getTraductionMap();
    //this.workout = null;
    //this.commentaire = '';

    //Get workout id
    const workoutIdEncode = this.route.snapshot.params['id'];
    this.workoutId = Util.hexDecode(workoutIdEncode);
    const workoutInfo = this.workoutId.split(';');
    const codeModule = workoutInfo[0];
    const titre = workoutInfo[1];
    const dateDebutPrevue = workoutInfo[2];

    this.getWorkout(codeModule, titre, dateDebutPrevue);

  }

  getWorkout(codeModule: string, titre: string, dateDebutPrevue: string): void {
    let lienDocument;
    this.workoutSubscription = this.programService.workoutSubject.subscribe(
      (workout) => {
        this.workout = workout;
        this.commentaire = this.workout.commentaire.toString();
        if(this.workout.lienDocument !== lienDocument) {
          if(this.workout.lienDocument && this.isYoutubeLink(this.workout.lienDocument.toString())) {
            this.youtubePlayer();
          }
        }
        this.cd.detectChanges();
      }
    );

    this.programService.getWorkoutById(codeModule, titre, dateDebutPrevue).then(
      (workout) => {
        this.workout = workout;
        lienDocument = workout.lienDocument;
        if(this.workout.lienDocument && this.isYoutubeLink(this.workout.lienDocument.toString())) {
          this.youtubePlayer();
        }
        this.commentaire = this.workout.commentaire.toString();
        this.cd.detectChanges();
      }
    ).catch();
  }


  onSubmitCommentaire() {
    //Vérification que le commentaire a changé
    if(this.commentaire !== this.workout.commentaire) {
      this.programService.putCommentOnWorkout(this.workout, this.commentaire).then(
        () => {
          this.workout.commentaire = this.commentaire
          this.cd.detectChanges();
        }
      );
    }
  }

  onChangeState(newState: string) {
    const date = new Date();
    const dateToString = this.datePipe.transform(date,"dd/MM/yyyy");
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: localStorage.getItem('sheetId'),
      range:'Exercices!G' + this.workout.range,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [newState]
        ]
      }
    }).then(() => this.cd.detectChanges());
    if(newState == "en cours") {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!I' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [dateToString]
          ]
        }
      }).then(() => this.cd.detectChanges());
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!K' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [""]
          ]
        }
      }).then(() =>this.cd.detectChanges());
    }
    if(newState == "terminé") {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: localStorage.getItem('sheetId'),
        range:'Exercices!K' + this.workout.range,
        valueInputOption: 'RAW',
        resource: {
          values: [
            [dateToString]
          ]
        }
      }).then(() => this.cd.detectChanges());
    }
    this.ngOnInit();
  }

  isYoutubeLink(urlLink: string): boolean {
    const regex = new RegExp('https:\/\/www\.youtube\.com\/watch\\?v=*');
    return regex.test(urlLink);
  }

  youtubePlayer() {
    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    let player;
    const workout = this.workout;
    const videoId = workout.lienDocument.split('?')[1].split('=')[1];
    window['onYouTubeIframeAPIReady'] = function() {
      player = new window['YT'].Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    function onPlayerStateChange() {
    }
    /*function stopVideo() {
      player.stopVideo();
    }*/
  }

  getTraductionMap() {
    this.traductionMapSubscription = this.programService.traductionMapSubject.subscribe(
      (traductionMap) => {
        this.traductionMap = traductionMap;
        this.cd.detectChanges();
      }
    );

    this.programService.getTraduction().then(
      (traductionMap) => {
        console.log('loadTraduction from home component');
        this.traductionMap = traductionMap;
        this.cd.detectChanges();
      }).catch();
  }
}
