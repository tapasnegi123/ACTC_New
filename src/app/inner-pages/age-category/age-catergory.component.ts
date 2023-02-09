import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin, map, Observable, Subject, takeUntil } from "rxjs";
import { AddAgeCategoryComponent } from "src/app/_common/modal-windows/add-age-category/add-age-category.component";
import { AlertService } from "src/app/_common/services/alert.service";
import { EquipmentAgeCategoryService } from "src/app/_common/services/equipments-age/equipments.service";
import { IUserCredentials, StorageService } from "src/app/_common/services/storage.service";
import Swal from "sweetalert2";

@Component({
  selector: "age-category",
  templateUrl: "./age-category.component.html",
  styleUrls: ["./age-category.component.scss"]
})

export class AgeCategoryComponent implements OnDestroy {
  page = 1;
  pageSize = 10;
  allData$: Observable<any> = new Observable();
  submitted: boolean = false;
  filterData: Array<any> = [];
  @ViewChild('closeBtn') closeBtn: ElementRef | undefined;
  masterData$: Array<any> = [];
  unsubscribe: Subject<any> = new Subject();
  sportsDetails$: Array<any> = [];
  userDetail!: IUserCredentials<any>;
  ageCategoryForm!: FormGroup;
  Loader:boolean = false

  constructor(private _ageCategoryService: EquipmentAgeCategoryService, private _localStorage: StorageService, private _fb: FormBuilder, private _alert: AlertService, private modalService: NgbModal) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.GetAgeCategortList();
  }

  addAgeCategory() {
    const modalRef = this.modalService.open(AddAgeCategoryComponent, { size: 'xl', centered: true, backdrop:'static'});
    modalRef.result.then((response) => {
      console.log(response)
      if(response)this.GetAgeCategortList();
    })
  }

  GetAgeCategortList() {
    this.Loader = true;
    let getmasterData$: Observable<any> = this._ageCategoryService.getAgeCateogory(this.userDetail?.sportId, "agecategory");
    this.allData$ = forkJoin([getmasterData$]).pipe(
      map(([getmasterData]) => {
        this.Loader = false;
        this.masterData$ = [...getmasterData];
        this.filterData = this.masterData$;
        return true;
      })
    )
  }

  deleteApiCall(obj: any) {
    this.Loader = true;
    this._ageCategoryService.deleteAgeCategory(obj).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.Loader = false;
      if(res) this._alert.ShowSuccess("Deleted Successfully");
      this.GetAgeCategortList();
    })
  }

  delete(obj: any) {
    let text = "You want to delete the record"
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
    this.masterData$ = this.filterData.filter(item => (item.name.toLowerCase().includes(searchText) || item.ageGroup.toLowerCase().includes(searchText))
    );
    return this.masterData$;
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}