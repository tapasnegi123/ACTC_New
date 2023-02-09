import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { EquipmentAgeCategoryService } from '../../services/equipments-age/equipments.service';
import { IUserCredentials, StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-add-age-category',
  templateUrl: './add-age-category.component.html',
  styleUrls: ['./add-age-category.component.scss']
})
export class AddAgeCategoryComponent implements OnInit {

  Loader: any;
  ageCategoryForm!: FormGroup;
  userDetail?: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject();

  constructor(
    public activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private _localStorage: StorageService,
    private _alert:AlertService,
    private _ageCategoryService: EquipmentAgeCategoryService
  ) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.ageCategoryForm = this.GetAgeCategoryForm();
  }

  saveAgeCategory() {
    let ageCategotyRowData = this.ageCategoryForm.getRawValue();
    if (!this.ageCategoryForm.valid) {
      this.ageCategoryForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this.Loader = true
      this._ageCategoryService.saveAgeCategory('insert', ageCategotyRowData).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
        if (res) {
          this.Loader = false
          this._alert.ShowSuccess("Data Saved Successfully");
        }
        this.CloseModal(true)
      })
    }
  }

  GetAgeCategoryForm() {
    return this._fb.group({
      name: ['', Validators.required],
      ageGroup: ['', Validators.required],
      sport_name: [{ value:this.userDetail?.sport_Name, disabled: true }, Validators.required],
      sport_detail_id: [this.userDetail?.sportId],
      id: [0]
    })
  }

  CloseModal(data:boolean){
    this.activeModal.close(data)
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }
}
