import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Workout} from "../../../model/workout.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProgramService} from "../../../service/program/program.service";
import Util from "../../../util/util";
import {DatePipe} from '@angular/common';
import {ToastService} from "../../../service/toast/toast.service";

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

  codeModule: string;
  titre: string;
  dateDebutPrevue: string;


  constructor(private route: ActivatedRoute,
              private programService: ProgramService,
              private cd: ChangeDetectorRef,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.getTraductionMap();
    this.getWorkout();
  }

  getId() {
    const workoutIdEncode = this.route.snapshot.params['id'];
    this.workoutId = Util.hexDecode(workoutIdEncode);
    const workoutInfo = this.workoutId.split(';');
    this.codeModule = workoutInfo[0];
    this.titre = workoutInfo[1];
    this.dateDebutPrevue = workoutInfo[2];
  }

  getWorkout(): void {
    console.log('getWorkout()');
    this.getId();
    let lienDocument;
    this.workoutSubscription = this.programService.workoutSubject.subscribe(
      (workout) => {
        this.workout = workout;
        this.commentaire = this.workout.commentaire;
        if(this.workout.lienDocument !== lienDocument) {
          if(this.workout.lienDocument && this.isYoutubeLink(this.workout.lienDocument)) {
            this.youtubePlayer();
          }
        }
        this.cd.detectChanges();
      }
    );

    this.programService.getWorkoutById(this.codeModule, this.titre, this.dateDebutPrevue).then(
      (workout) => {
        this.workout = workout;
        lienDocument = workout.lienDocument;
        if(this.workout.lienDocument && this.isYoutubeLink(this.workout.lienDocument)) {
          this.youtubePlayer();
        }
        this.commentaire = this.workout.commentaire;
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
          this.toastService.show('Commentaire envoyé', { classname: 'bg-success text-light'});
          this.cd.detectChanges();
        }
      ).catch(
        () => {
          this.toastService.show('Erreur lors de l\'envoie du commentaire', { classname: 'bg-danger text-light'});
        }
      );
    }
  }

  onChangeState(newState: string) {
    this.programService.changeState(newState).then(
      () => {
        this.getWorkout();
        this.toastService.show('Modification prises en compte', { classname: 'bg-success text-light'});
        this.cd.detectChanges();
      }
    ).catch(
      () => {
        this.toastService.show('Erreur lors de la modification', { classname: 'bg-danger text-light'});
      }
    );
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
