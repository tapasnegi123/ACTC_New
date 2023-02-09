import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonFormsService, IFormList } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-part-c',
  templateUrl: './part-c.component.html',
  styleUrls: ['./part-c.component.scss']
})
export class PartCComponent implements OnInit {
  @Input() year:any
  @Input() userData!:IUserCredentials<any>
  section:string | undefined = 'Form_PartC_home'
  btnObj = [
    {
      btnId:1,
      btnName:'SECTION 1',
    },
  ]

  formId = 3
  actcFormList$:Observable<any> = new Observable()

  constructor(private _actcCommon:CommonFormsService) { }

  ngOnInit(): void {
    this.GetFormList();  
  }

  formList!:IFormList[]
  GetFormList(){
    this.actcFormList$ = this._actcCommon.GetFormList(this.formId, this.year, this.userData?.sportId).pipe(
      map(response => {
        console.log(response);
        this.formList = [...response.formList]
        return response.formList
      } )
    )
  }

  FormHome(){
    this.section = 'Form_PartC_home'
  }
  ToggleSectionTemplate(data:IFormList){
    console.log("ToggleSectionTemplate is called ")
    console.log(data)
    // let status = this._actcCommon.ToggleSectionTemplate(data) //if isfilledby_nsf is true prohibit user navigation. Make changes in line 38 in template file
    let status  = data.formName
    
    if(status == " ")this.section = "Form_PartC_home"
    else this.section = status
    console.log(this.section);
    // if(data.isfilledby_nsf) this.section = data.formName 
  };

  formListData:any
  GoToSectionOne(formName:any){
    // this.section = data
    console.log(this.formList)
    let formListObj = this.formList.find( (obj) => obj.formName === formName)
    this.formListData = formListObj
    this.section = formListObj?.formName
  };
}
