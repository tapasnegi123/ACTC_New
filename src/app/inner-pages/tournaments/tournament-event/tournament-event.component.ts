import { Component, OnInit } from '@angular/core';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';
import { TournamentService } from 'src/app/_common/services/tournament.service';
import { AlertService } from 'src/app/_common/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEventComponent } from 'src/app/_common/modal-windows/add-event/add-event.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tournament-event',
  templateUrl: './tournament-event.component.html',
  styleUrls: ['./tournament-event.component.scss']
})
export class TournamentEventComponent implements OnInit {

  page = 1;
  pageSize = 10;
  eventListSportWise:  Array<any> = []
  filterData: Array<any> = [];
  userData!: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject;
  Loader: boolean = false;

  constructor(private _tournamentService: TournamentService, private _localStorage: StorageService,
    private _alert: AlertService,
    private modalService: NgbModal
  ) { this.userData = this._localStorage.GetUserAllCredentials() }

  ngOnInit() {
    this.GetEventDataList();
  }

  GetEventDataList() {
    this.Loader = true
    this._tournamentService.getEventDetailSportWise(this.userData.sportId).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.Loader = false
      this.eventListSportWise = [...res];
      this.filterData = this.eventListSportWise;

    })
  }

  addEvent() {
    const modalRef = this.modalService.open(AddEventComponent, { size: 'xl', centered: true, backdrop:'static' })
    modalRef.result.then(() => {
      this.GetEventDataList();
    })
  }

  deleteRow(event_id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `you won't be able to revert this`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.Loader = true
        this._tournamentService.deleteEventMaster(event_id, this.userData.user_id).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
          this.Loader = false
          res ? this._alert.ShowSuccess("Row Delete Successfully") : this._alert.ShowWarning("Row is Not Deleted", 0, "This Event is already completed", true, "OK");
          this.GetEventDataList();
        })
      }
    })
  }

  filter(searchText: any) {
    if (!this.eventListSportWise) return [];
    if (!searchText) return this.eventListSportWise = this.filterData
    searchText = searchText.toLowerCase();
    this.eventListSportWise = this.filterData.filter(item => (item.event_name.toLowerCase().includes(searchText) || item.sport.toLowerCase().includes(searchText) || item.gender_category.toLowerCase().includes(searchText) || item.event_type.toLowerCase().includes(searchText)));
    return this.eventListSportWise;
  }

  ngOnDestroy() {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}
