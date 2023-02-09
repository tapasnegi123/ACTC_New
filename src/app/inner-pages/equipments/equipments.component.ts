import { Component, OnDestroy } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin, map, Observable, Subject, takeUntil } from "rxjs";
import { AddEquipmentComponent } from "src/app/_common/modal-windows/add-equipment/add-equipment.component";
import { AlertService } from "src/app/_common/services/alert.service";
import { EquipmentAgeCategoryService } from "src/app/_common/services/equipments-age/equipments.service";
import { IUserCredentials, StorageService } from "src/app/_common/services/storage.service";
import Swal from "sweetalert2";


@Component({
  selector: "equipments",
  templateUrl: "./equipments.component.html",
  styleUrls: ["./equipments.component.scss"]
})

export class EquipmentsComponent implements OnDestroy {
  page = 1;
  pageSize = 10;
  filterData: Array<any> = [];
  unsubscribe: Subject<any> = new Subject();
  allData$: Observable<any> = new Observable();
  submitted: boolean = false;
  masterData$: Array<any> = [];
  sportsDetails$: Array<any> = [];
  userDetail?: IUserCredentials<any>
  equipementForm!: FormGroup;
  Loader:any;

  constructor(
    private _equipment_Service: EquipmentAgeCategoryService,
    private _localStorage: StorageService,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private modalService: NgbModal
  ) { this.userDetail = this._localStorage.GetUserAllCredentials() }

  ngOnInit() {
    this.GetEquipmentData()
  }

  addEquipment() {
    const modalRef = this.modalService.open(AddEquipmentComponent, { size: 'xl', centered: true, backdrop:'static' });
    modalRef.result.then(() => {
      this.GetEquipmentData();
    })
  }

  GetEquipmentData() {
    this.Loader=true;
    let getmasterData$: Observable<any> = this._equipment_Service.getACTCMasterData(this.userDetail?.sportId, "equipment")
    this.allData$ = forkJoin([getmasterData$]).pipe(
      map(([getmasterData]) => {
        this.Loader=false;
        this.masterData$ = [...getmasterData];
        this.filterData = this.masterData$;
        return true
      })
    )
  }

  deleteApiCall(obj: any) {
    this.Loader=true;
    this._equipment_Service.deleteSportId(obj).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.Loader=false;
      this._alert.ShowSuccess("Deleted Successfully");
      this.GetEquipmentData();
    })
  }

  delete(obj: any) {
    let text = "You want to delete the equipment"
    this.ConfirmationDialog(obj, text);
  }

  ConfirmationDialog(value: boolean, text: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `${text}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteApiCall(value);
      }
    })
  }

  filter(event: any) {
    let searchText = event.target.value;
    if (!this.masterData$) return [];
    if (!searchText) return this.masterData$ = this.filterData
    searchText = searchText.toLowerCase();
    this.masterData$ = this.filterData.filter(item => (item.sport_name.toLowerCase().includes(searchText) || item.is_consumeable.toLowerCase().includes(searchText) || item.equipment_Name.toLowerCase().includes(searchText))
    );
    return this.masterData$;
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}