import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { CommonFormsService } from '../../services/actc-forms-service/common-forms.service';
import { AlertService } from '../../services/alert.service';
import { IUserCredentials, StorageService } from '../../services/storage.service';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  AddEventForm!: FormGroup;
  genderArray: Array<any> = [{ id: '1', value: 'Male' }, { id: '2', value: 'Female' }, { id: '3', value: 'Others' }];
  eventTypeArray: Array<any> = [{ id: '1', value: 'Individual Event' }, { id: '2', value: 'Team Event' }];
  unsubscribe: Subject<any> = new Subject;
  sportList: any;
  userDetail!: IUserCredentials<any>;
  Loader: boolean = false;

  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public _tournamentService: TournamentService,
    private _localStorage: StorageService,
    private _alert: AlertService,
  ) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.AddEventForm = this.getEventForm();
  }

  saveEvent() {
    if (!this.AddEventForm.valid) {
      this.AddEventForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    }
    else {
      this.Loader = true
      this._tournamentService.createTournamentEvent(this.AddEventForm.value).pipe(takeUntil(this.unsubscribe)).subscribe(
        (response: any) => {
          this.Loader = false
          if (response) this._alert.ShowSuccess("Data Saved Successfully");
          this.activeModal.close()
        }
      )
    }
  }

  getEventForm() {
    return this._fb.group({
      event_name: ['', Validators.compose([Validators.required])],
      gender_category: ['', Validators.required],
      eventtype: ['', Validators.compose([Validators.required])],
      sport_id: [this.userDetail.sportId],
      created_by: [this.userDetail.user_id]
    })
  }
}
