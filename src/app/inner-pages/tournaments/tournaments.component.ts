import { IUserCredentials, StorageService } from './../../_common/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/_common/services/alert.service';
import { ItournamendData, TournamentService } from 'src/app/_common/services/tournament.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AddTournamentComponent } from 'src/app/_common/modal-windows/add-tournament/add-tournament.component';
import { MapEventTournamnetComponent } from 'src/app/_common/modal-windows/map-event-tournamnet/map-event-tournamnet.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {
  constructor(
    private _tournamentService: TournamentService,
    private _alert: AlertService,
    private modalService: NgbModal,
    private _localStorage: StorageService
  ) { this.userData = this._localStorage.GetUserAllCredentials() }

  page = 1;
  pageSize = 10;
  filterData: Array<any> = [];
  userData!: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject;
  Loader:boolean = false
  appid: number = 2;
  listTournament: Array<any> = []
  tournamentList$: Observable<any> = new Observable();

  ngOnInit() {
    this.GetTournamentList();
  }

  GetTournamentList() {
    this.Loader = true
    this.tournamentList$ = this._tournamentService.GetTournamentList(this.appid, this.userData.user_id).pipe(
      map((res: any) => {
        this.Loader = false;
        this.listTournament = [...res];
        this.filterData = this.listTournament;
        return res;
      }))
  }

  addTournament() {
    const modalRef = this.modalService.open(AddTournamentComponent, { size: 'xl', centered: true, backdrop:'static' });
    modalRef.result.then(() => {
      this.GetTournamentList();
    });
  }

  editTournamnetData(data: ItournamendData) {
    const modalRef = this.modalService.open(AddTournamentComponent, { size: 'xl', centered: true, backdrop:'static' });
    modalRef.componentInstance.tournamentData = data;
    modalRef.result.then(() => {
      this.GetTournamentList();
    });
  }

  deleteRow(data: ItournamendData) {
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
        this._tournamentService.deleteTournament(data.tournament_Detail_Id).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
          this.Loader = false
          res ? this._alert.ShowSuccess("Row Delete Successfully") : this._alert.ShowWarning("We can't Delete Tournament", 0, "Please select correct tournamnet", true, "OK");
          this.GetTournamentList();
        })
      }
    })
  }
  mapEvent(data: ItournamendData){
    const modalRef = this.modalService.open(MapEventTournamnetComponent, { size: 'xl', centered: true, backdrop:'static' });
    modalRef.componentInstance.tournamentData = data;
  }

  filter(searchText: any) {
    if (!this.listTournament) return [];
    if (!searchText) return this.listTournament = this.filterData
    searchText = searchText.toLowerCase();
    this.listTournament = this.filterData.filter(item => (item.tournament_Category_Name.toLowerCase().includes(searchText) || item.category.toLowerCase().includes(searchText) || item.tournament_Name.toLowerCase().includes(searchText) || item.tournament_Level.toLowerCase().includes(searchText) || item.venue.toLowerCase().includes(searchText))
    );
    return this.listTournament;
  }

  ngOnDestroy() {
    this.modalService.dismissAll()
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }

}
