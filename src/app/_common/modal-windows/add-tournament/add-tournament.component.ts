import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { CommonFormsService } from '../../services/actc-forms-service/common-forms.service';
import { AlertService } from '../../services/alert.service';
import { IUserCredentials, StorageService } from '../../services/storage.service';
import { ItournamendData, TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-add-tournament',
  templateUrl: './add-tournament.component.html',
  styleUrls: ['./add-tournament.component.scss']
})
export class AddTournamentComponent implements OnInit {

  tournamentForm!: FormGroup;
  unsubscribe: Subject<any> = new Subject;
  userDetail!: IUserCredentials<any>;
  tournamentLevel: Array<any> = ["National", "International"];
  category: Array<any> = ["Senior", "Junior"];
  tournamentCategoryList: any;
  ageDataList: any;
  countryList: any;
  stateList: any;
  cityList: any;
  tournamentData!: ItournamendData;
  Loader: boolean = false

  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public _tournamentService: TournamentService,
    private _localStorage: StorageService,
    private _alert: AlertService,
    private _actcCommon: CommonFormsService
  ) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.tournamentForm = this.getTournamentForm();
    this.getTournamentCateList();
    this.getAgeCategList();
    this.getCountryList();
    this.PatchValues();
  }

  getTournamentCateList() {
    this.Loader = true
    this._tournamentService.getTournamentCategoryData().pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response: any) => {
        this.Loader = false
        this.tournamentCategoryList = response.filter((obj: any) => obj.sport_detail_id == 0 || obj.sport_detail_id == this.userDetail.sportId)
      }
    })
  }

  getAgeCategList() {
    this._tournamentService.getAgeCategoryData().pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (response: any) => {
        this.ageDataList = response;
      }
    })
  }

  getCountryList() {
    this._tournamentService.getCountryData().pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.countryList = res
    })
  }

  countrySelect(countryID: any) {
    this.Loader = true
    this._tournamentService.getStateData(countryID).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.Loader = false
      this.stateList = res;
    })
  }

  stateSelect(stateID: any) {
    this.Loader = true
    this._tournamentService.getCityData(stateID).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.Loader = false
      this.cityList = res;
    })
  }

  saveTournament() {
    if (!this.tournamentForm.valid) {
      this.tournamentForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    }
    else {
      this.Loader = true
      this._tournamentService.SaveTournament(this.tournamentForm.value).pipe(takeUntil(this.unsubscribe)).subscribe(
        (response: any) => {
          this.Loader = false
          if (response.status == '1') this._alert.ShowSuccess("Data Saved Successfully");
          this.activeModal.close()
        }
      )
    }
  }

  PatchValues() {
    if (this.tournamentData != undefined) {
      this.countrySelect(this.tournamentData.venue_country);
      this.stateSelect(this.tournamentData.venue_state);

      this.tournamentForm.patchValue({
        tournamentId:this.tournamentData.tournament_Detail_Id,
        tournamentCategoryId:this.tournamentData.tournament_Category_Id,
        tournamentName:this.tournamentData.tournament_Name,
        tournamentEdition:this.tournamentData.tournament_Edition,
        tournamentYear:this.tournamentData.tournament_Year,
        tournamentLevel:this.tournamentData.tournament_Level,
        category:this.tournamentData.category,
        age_group:this.tournamentData.age_group,
        startDate:this._actcCommon.ConvertStringToCalendarDateFormat(this.tournamentData.from_Date),
        endDate:this._actcCommon.ConvertStringToCalendarDateFormat(this.tournamentData.to_date),
        place:this.tournamentData.venue,
        country:this.tournamentData.venue_country,
        state:this.tournamentData.venue_state,
        city:this.tournamentData.venue_city,
      })
    }
  }

  protected MinMaxDate(formArrayName: any, formControlName: string) {
    return formArrayName.get(formControlName)?.value
  }

  getTournamentForm() {
    return this._fb.group({
      tournamentId: [0],
      tournamentCategoryId: ['', Validators.compose([Validators.required])],
      tournamentName: ['', Validators.compose([Validators.required])],
      tournamentEdition: ['', Validators.compose([Validators.required, Validators.pattern(/^[\d]{0,2}$/)])],
      tournamentYear: ['', Validators.compose([Validators.required, Validators.pattern(/^(19|[2-9][0-9])\d{2}$/)])],//for years 1900 - 9999.
      tournamentLevel: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      age_group: ['', Validators.compose([Validators.required])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])],
      place: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      userid: [this.userDetail?.user_id],
      appId: [2],
      disciplines: [this.userDetail.sportId.toString()],
    })
  }

  ngOnDestroy() {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}
