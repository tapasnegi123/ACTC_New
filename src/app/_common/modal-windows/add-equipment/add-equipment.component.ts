import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { EquipmentAgeCategoryService } from '../../services/equipments-age/equipments.service';
import { IUserCredentials, StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss']
})
export class AddEquipmentComponent implements OnInit {

  equipementForm!: FormGroup;
  Loader: any;
  EquipmentCat: Array<any> = ['consumable', 'Non-Consumable'];
  userDetail!: IUserCredentials<any>;
  unsubscribe: Subject<any> = new Subject;

  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private _localStorage: StorageService,
    private _alert: AlertService,
    private _equipment_Service: EquipmentAgeCategoryService,
  ) { }

  ngOnInit() {
    this.userDetail = this._localStorage.GetUserAllCredentials();
    this.equipementForm = this.GetEquipementForm();
  }

  saveEquipment() {
    let equipmentrowData = this.equipementForm.getRawValue();
    if (!this.equipementForm.valid) {
      this.equipementForm.markAllAsTouched();
      this._alert.ShowWarning('Invalid data input', 0, "Please enter valid information.", true, "OK");
    } else {
      this._equipment_Service.saveSportsEquipments('insert', equipmentrowData).pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
        if (res) {
          this._alert.ShowSuccess("Data Saved Successfully");
        }
        this.activeModal.close();
      })
    }
  }

  GetEquipementForm() {
    return this._fb.group({
      equipment_Id: [0],
      equipment_Name: ['', Validators.required],
      is_consumeable: ['', Validators.required],
      sport_name: [{ value: this.userDetail.sport_Name, disabled: true }],
      sport_detail_id: [this.userDetail.sportId]
    })
  }

  ngOnDestroy() {
    this.unsubscribe.next(1);
    this.unsubscribe.complete();
  }

}
