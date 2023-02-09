import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { map, Observable, takeUntil, Subject, lastValueFrom, firstValueFrom, findIndex } from 'rxjs';
import { CommonFormsService, IFormList, IGetFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';

@Component({
  selector: 'app-actc-forms-part-A',
  templateUrl: './actc-forms-part-A.component.html',
  styleUrls: ['./actc-forms-part-A.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActcFormsPartAComponent implements OnInit {

  @Input() userData:any
  @Input() year:any
  constructor(private _actcCommon:CommonFormsService) { }

  ngOnInit() {
    this.GetFormList()
  }

  formId = 1
  actcFormList$:Observable<any> = new Observable()
  formList!:IFormList[]
  unsubscribe:Subject<any> = new Subject()
  GetFormList(){
    this.actcFormList$ = this._actcCommon.GetFormList(this.formId,this.year,this.userData.sportId).pipe(
      map(response => {
        this.formList = [...response.formList]
        return response
      }),
      takeUntil(this.unsubscribe)
    )
  }

  section:string|undefined = 'Form_PartA_home'
  formListData:any
  ToggleSectionTemplate(data:IFormList){
    // this.section = data.formName
    if(this.section !== data.formName){
      let status = this._actcCommon.ToggleSectionTemplate(data,this.formList)
      this.formListData = data
      if(status != (null || '')){
        this.section = status
      }else{
        return 
      }
    }
  }

  FormHome(){
    this.section = 'Form_PartA_home'
  }

  showLoader:boolean = false
  @Output() dataFromPartA:EventEmitter<any> = new EventEmitter()
  DataFromChildComponent(data:any){
    if(typeof data == "string"){
      let res = this.formList.find( obj => obj.formName === data)
      this.formListData = res
      this.section = data
      return  
    }
    let formIndex = this.formList.indexOf(data)
    this.formList[formIndex].isfilledby_nsf = true

    if((this.formList.length - 1) == formIndex){
      this.dataFromPartA.emit(1)
      this.formListData = this.formList[0] 
      this.section = this.formList[0].formName  
    }else{
      this.formListData = this.formList[formIndex + 1] 
      this.section = this.formList[formIndex + 1].formName
      return
    }
    // return 
  }

  GoToSectionOne(formName:string){
    let formListObj = this.formList.find( (obj) => obj.formName === formName)
    this.formListData = formListObj
    this.section = formListObj?.formName
  }

}
