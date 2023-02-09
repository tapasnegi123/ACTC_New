import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-part-e',
  templateUrl: './part-e.component.html',
  styleUrls: ['./part-e.component.scss']
})
export class PartEComponent implements OnInit {
  @Input() year: any;
  formList: Array<any> = [];

  btnObj = [
    {
      btnId: 1,
      btnName: 'SECTION 1',
    },
    {
      btnId: 2,
      btnName: 'SECTION 2',
    },

  ]

  formId = 5;
  actcFormList$: Observable<any> = new Observable();
  section = 'Form_PartE_home';
  unsubscribe: Subject<any> = new Subject();
  @ViewChildren('sectionBtn') sectionBtn!: QueryList<ElementRef>
  @ViewChild("formDescription") formDescription!: ElementRef
  constructor(private _actcCommon: CommonFormsService, private _localStorage: StorageService) { }
  userDetail: any
  ngOnInit(): void {
    this.userDetail = this._localStorage.GetUserDetailAfterLogin();
    this.GetFormList();
  }
  GetFormList() {
    this.actcFormList$ = this._actcCommon.GetFormList(this.formId, this.year, this.userDetail.sportId).pipe(
      map(response => {
        this.formList = [...response.formList]
        return response.formList
      }),
      takeUntil(this.unsubscribe)
    )
  }

  formListData: any
  ToggleSectionTemplate(data: IFormList) {
    if (this.section !== data.formName) {
      let status = this._actcCommon.ToggleSectionTemplate(data, this.formList)
      this.formListData = data
      if (status != (null || '')) {
        this.section = status
      } else {
        return
      }
    }
  }


  FormHome() {
    this.section = 'Form_PartE_home'
  };

  GoToSectionOne(formName: any) {
    // this.section = data
    console.log(this.formList)
    let formListObj = this.formList.find( (obj) => obj.formName === formName)
    this.formListData = formListObj
    this.section = formListObj?.formName
  };

  @Output() dataFromPartE:EventEmitter<any> = new EventEmitter()
  DataFromChildComponent(data: any) {

    if(typeof data == "string"){
      let res = this.formList.find( obj => obj.formName === data)
      this.formListData = res
      this.section = data
      return  
    }
    let formIndex = this.formList.indexOf(data)
    this.formList[formIndex].isfilledby_nsf = true
    this.formListData = this.formList[formIndex + 1] 
    this.section = this.formList[formIndex + 1].formName
  }
}
