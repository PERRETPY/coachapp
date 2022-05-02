import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  public programLoadEvent: EventEmitter<any> = new EventEmitter();
  public programSheetIdEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  changeProgramLoaded(loaded: boolean) {
    this.programLoadEvent.emit(loaded);
  }

  getEmittedValued() {
    return this.programLoadEvent;
  }
}
