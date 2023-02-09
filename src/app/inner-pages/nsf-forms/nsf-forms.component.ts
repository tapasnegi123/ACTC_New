import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonFormsService, IFormCategory } from 'src/app/_common/services/actc-forms-service/common-forms.service';
import { RouteDateService } from 'src/app/_common/services/route-date.service';
import { IUserCredentials, StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-nsf-forms',
  templateUrl: './nsf-forms.component.html',
  styleUrls: ['./nsf-forms.component.scss']
})
export class NsfFormsComponent {

  btnOptions:Array<any> = [
    {
      btnName: 'PART A',
      btnId: 1,
      imgSrc: '/assets/images/dashboard/Athletes.svg',
    },
    {
      btnName: 'PART B',
      btnId: 2,
      imgSrc: '/assets/images/dashboard/Football.svg',
    },
    {
      btnName: 'PART C',
      btnId: 3,
      imgSrc: '/assets/images/dashboard/Spending.svg',
    },
    {
      btnName: 'PART D',
      btnId: 4,
      imgSrc: '/assets/images/dashboard/tops.svg',
    },
    {
      btnName: 'PART E',
      btnId: 5,
      imgSrc: '/assets/images/dashboard/file-chart-line (1).svg',
    },
  ];

  presentYear: any;
  userData!: IUserCredentials<any>;
  year!: number

  constructor(private _localStorage: StorageService, private _activatedRoute:ActivatedRoute ,private _actcCommon:CommonFormsService,
    private _routeDate:RouteDateService) {
    this.presentYear = new Date().getFullYear();
    this.userData = this.GetUserDetail()
  }

  ngOnInit() {
    this._routeDate.SetData(2222)
    this._activatedRoute.paramMap.subscribe({ 
      next: (response:any) => {
        console.log(response?.params.year)
        // this._routeDate.SetData(response?.params?.year)
        this.year = Number(response?.params?.year);
      }
    })
    this.GetDataList()
  }

  formCategories:Array<IFormCategory> = []
  GetUserDetail() {
    return this._localStorage.GetUserAllCredentials();
  }
  
  unsubscribe:Subject<any> = new Subject()
  section: number = 1;

  GetDataList(){
    this._actcCommon.GetFormList(this.section,this.year,this.userData.sportId).pipe(takeUntil(this.unsubscribe)).subscribe({
      next:(response) => {
        this.formCategories = [...response.formCategories]
        console.log(this.formCategories)
        this.btnOptions.map( (element,index) => {
          this.formCategories[index].imgSrc = element.imgSrc
        })
      }
    })
  }

  ngOnDestroy(){
    this.unsubscribe.unsubscribe
  }
  
  ToggleTemplate(data: IFormCategory) {
    if(this.section !== data.category_Id){
      let status = this._actcCommon.ToggleCategories(data,this.formCategories)
      if(status != (null || '')){
        this.section = status
      }else{
        return 
      }
    }
  }

  DataFromChildComponent(data: any) {
    let objRes = this.formCategories.find( obj => obj.category_Id === data)!
    console.log(objRes)
    let categoryIndex = this.formCategories.indexOf(objRes)
    this.formCategories[categoryIndex].is_Eanble = true

    if(data == 2){
      this.formCategories[categoryIndex + 1].is_Eanble = true
    }

    if(data == 4)this.section = 5
  }

  get GetDateRange(){
    return `${this.year} - ${this.year + 1}`
  }


}
