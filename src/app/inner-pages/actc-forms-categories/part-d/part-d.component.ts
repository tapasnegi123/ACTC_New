import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonFormsService, IFormList, IGetFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';

@Component({
  selector: 'app-part-d',
  templateUrl: './part-d.component.html',
  styleUrls: ['./part-d.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartDComponent implements OnInit {
  @Input() year:any
  @Input() userData:any

  section:string = 'Form_PartD_home';

  formId = 4;
  actcFormList$:Observable<any> = new Observable();

  constructor(private _actcCommon:CommonFormsService) { }

  ngOnInit(): void {
    this.GetFormList();
    console.log(this.year);
  }
  
  formList:Array<any> = []
  completeFormList:Array<any> = []
  GetFormList(){
    this.actcFormList$ = this._actcCommon.GetFormList(this.formId, this.year, this.userData.sportId).pipe(
      map(response => {
        this.formList = [...response.formList]
        return response.formList
      } )
    )
  };

  FormHome(){
    this.section = 'Form_PartD_home'
  }

  formListData:any
  ToggleSectionTemplate(data:IFormList){
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

  GoToSectionOne(formName:any){
    let formListObj = this.formList.find( (obj) => obj.formName === formName)
    this.formListData = formListObj
    this.section = formListObj?.formName
  }


  @Output() dataFromPartD:EventEmitter<any> = new EventEmitter()
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
      this.dataFromPartD.emit(4)
    }else{
      this.formListData = this.formList[formIndex + 1] 
      this.section = this.formList[formIndex + 1].formName
      return
    }
  }


}
