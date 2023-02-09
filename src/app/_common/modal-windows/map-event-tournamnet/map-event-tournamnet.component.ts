import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { concatMap, map, Observable, Subject } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { IUserCredentials, StorageService } from '../../services/storage.service';
import { ItournamendData, TournamentService } from '../../services/tournament.service';
import { ditinctEvents } from 'src/app/_common/utilities/nsf.util'

@Component({
  selector: 'app-map-event-tournamnet',
  templateUrl: './map-event-tournamnet.component.html',
  styleUrls: ['./map-event-tournamnet.component.scss']
})
export class MapEventTournamnetComponent implements OnInit {

  Loader: boolean = false;
  tournamentData!: ItournamendData;
  userDetail!: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject;
  EventsList: any;
  eventCheckboxArrayForm!: FormGroup
  mappedEvents: any;
  uncheckedList: any
  eventIdArray: any = []
  eventListData$: Observable<any> = new Observable;

  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public _tournamentService: TournamentService,
    private _localStorage: StorageService,
    private _alert: AlertService,
  ) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.GetEventdetailSportwise();
    this.eventCheckboxArrayForm = this.getEventCheckboxForm()
  }

  getEventCheckboxForm() {
    return this._fb.group({
      eventCheckBox: this._fb.array([]),
      eventUnCheckbox: this._fb.array([])
    })
  }

  get eventCheckboxArray(): FormArray {
    return this.eventCheckboxArrayForm.get("eventCheckBox") as FormArray
  }
  get eventUncheckboxArray(): FormArray {
    return this.eventCheckboxArrayForm.get("eventUnCheckbox") as FormArray
  }

  private addCheckBoxes() {
    this.eventCheckboxArray.push(new FormControl(false));
  }

  private disableAddCheckBoxes() {
    this.eventUncheckboxArray.push(new FormControl(true));
    this.eventUncheckboxArray.disable()
  }

  GetEventdetailSportwise() {
    this.Loader = true;
    this.eventListData$ = this._tournamentService.getEventDetailSportWise(this.userDetail.sportId).pipe(
      concatMap(allEventList => this._tournamentService.getEventView(this.tournamentData.tournament_Detail_Id, this.userDetail.sportId).pipe(
        map((mappedEvent: any) => {
          this.Loader = false;
          this.EventsList = allEventList;
          this.mappedEvents = mappedEvent
          console.log(this.EventsList)
          console.log(this.mappedEvents)
          this.mappedEvents.forEach(() => this.disableAddCheckBoxes())
          this.uncheckedList = ditinctEvents(this.EventsList, this.mappedEvents)
          this.uncheckedList.forEach(() => this.addCheckBoxes())
          console.log(this.uncheckedList)
          return true
        })
      ))
    )
  }

  eventCheckboxChange(checkBoxValue: any, id: any) {
    console.log(checkBoxValue)
    console.log(id)
    if (checkBoxValue == true) {
      this.eventIdArray.push(id)
    } else {
      for (let i in this.eventIdArray) {
        if (this.eventIdArray[i] == id) {
          delete this.eventIdArray[i];
        }
      }
    }
    console.log(this.eventIdArray)
  }

  saveEvent() {
    let filtered = this.eventIdArray.filter((el: any) => {
      return el != null;
    });
    let selectedCheckbox = filtered.toString()
    if (this.eventCheckboxArrayForm.valid && filtered.length > 0) {
      this.Loader = true;
      this._tournamentService.saveEvent(this.tournamentData.tournament_Detail_Id, selectedCheckbox).subscribe((res: any) => {
        this.Loader = false;
        if (res.status == true) {
          this._alert.ShowSuccess("Events Mapped Successfully");
          this.activeModal.close();
        } else {
          this._alert.ShowWarning("Error",0,"Something Went Wrong With Server. Please Try Again",true,"Ok");
          this.activeModal.close();
        }
      })
    }
    else{
      this._alert.ShowWarning("Error",0,"Please Select At Least One Event",true,"Ok");
    }
  }

}
