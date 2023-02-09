import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpService } from '../../core-services/http.service';
import { DatePipe } from '@angular/common';
import differenceInHours from 'date-fns/differenceInHours';

@Injectable({
  providedIn: 'any',
})
export class CommonFormsService {
  constructor(private _api: HttpService,private _datePipe:DatePipe) {}

  MinMaxDate(formArrayName:FormArray,formControlName:string,index:number){
    return formArrayName.controls[index].get(formControlName)?.value
  }

  DateDifference(fromDate:any,toDate:any){
    if(fromDate == "" || toDate == ""){
      return ""
  }else{
      return Math.floor(differenceInHours(new Date(toDate), new Date(fromDate))/24)|0 
  }
  }

  GetPreviousYears(numberOfPreviousYears:number){
    let dateArr:Array<any> = []
    const presentDate = new Date()
    for(let i = 0; i < numberOfPreviousYears ; i++){
      dateArr.push(presentDate.getFullYear() - i)
    }
    return dateArr
  }

  GetDifferenceBetweenTwoDates(formArray:FormArray,index: any,fromFormControlName:string,toFormControlName:string) {
    const fromDate = new Date(formArray.controls[index].get(fromFormControlName)?.value);
    const toDate = new Date(formArray.controls[index].get(toFormControlName)?.value);
    const Time = toDate.getTime() - fromDate.getTime();
    const Days = Time / (1000 * 3600 * 24);
    return Days
  }

  ConvertStringToCalendarDateFormat(date:any){
    let result = this._datePipe.transform(date,"yyyy-MM-dd") 
    return result
  }

  ConvertStringToArray(data:any){
    let a = data.split(',')
    console.log(a)
  }
 
  CapitalizeFirstLetterOfString(data:string|any){
    let result = data?.toLowerCase()
    return (result != ("" || null || undefined || " ")) ? result?.charAt(0).toUpperCase() + result?.slice(1) : ""
  }

  DisableWhenFormIsInvalid(formArry:FormArray){
    return (formArry.status == "INVALID")?true:false
  }

  ToggleSectionTemplate(data:IFormList,formList:IFormList[]){

    let index:number = formList.indexOf(data,0)

    let presentIsFilledNsf = data.isfilledby_nsf
    let previousIsFilledNsf
    if(index == 0){
      previousIsFilledNsf = formList[formList.length - 1].isfilledby_nsf
    }else{
      previousIsFilledNsf = formList[index-1].isfilledby_nsf
    }

    if(data.sortOrder == 1){
      return data.formName
    }

  if(!presentIsFilledNsf && !previousIsFilledNsf){
    return ''
  }else{
    return data.formName
  }    
  }


  ToggleCategories(data:any,formCategories:IFormCategory[]){
    let categoriesIndex = formCategories.indexOf(data,0)
    let presentIsFilledNsf = data.is_Eanble
    let previousIsFilledNsf
    if(categoriesIndex == 0){
      previousIsFilledNsf = formCategories[formCategories.length - 1].is_Eanble
    }else{
      previousIsFilledNsf = formCategories[categoriesIndex-1].is_Eanble
    }

    if(!presentIsFilledNsf && !previousIsFilledNsf){
      return '' 
    }else{
      return data.category_Id
    }
  }

  GetFormList(id:number,Fin_Yr:number,SportId:number):Observable<IGetFormList>{
    return this._api.getACTC('Common/FormList?id='+id+'&Fin_Yr='+Fin_Yr+'&SportId='+SportId)
  }

  GetEquipmentList(sportId: any) {
    return this._api.getACTC('Common/GetEquipmentDD?sport=' + sportId);
  }

  GetCurrencyList():Observable<ICurrencyDD[]> {
    return this._api.getACTC('Common/GetCurrencytDD');
  }

  GetTOPSNCOEDD(sportId:number):Observable<any>{
    return this._api.getACTC("Common/GetTOPSNCOEDD?sport=" + sportId)
  }

  GetStateDD(){
    return this._api.getACTC("Common/GetStateDD")
  }

  // get country list
  GetCountryDD(nationalORinternational:string):Observable<any>{
    return this._api.getACTC("Common/GetCountryDD?Type="+nationalORinternational)
  }
  // get state list
  GetStateByCountryDD(Country_Id:number){
    return this._api.getACTC("Common/GetStateByCountryDD?Country_Id="+Country_Id)
  }
  // get city list
  GetCityByStateDD(State_Id:number){
    debugger
    return this._api.getACTC('Common/GetStateByCountryDD?Country_Id='+State_Id)
  }

  //Tournament_Id is competetionId. That's why competetionId is used
  // GetEventDD(sportId:number,competetionId:number):Observable<IStateDD[]>{
  //   return this._api.getACTC("Common/GetEventDD?sport=" + sportId + "&Tournament_Id=" + competetionId)
  // }
  GetEvent(sportId:number):Observable<IStateDD[]>{
    return this._api.getACTC("Common/GetEventDD?sport=" + sportId)
  }
  /**
   * @param staffType of type string
   * @return array of object of type {id:number,name:string}
   */
  GetStakeholderDesignationDD(staffType:string):Observable<any>{
    return this._api.getACTC("Common/getStakeholderDesignationDD?Stakeholder=" + staffType)
  }

  /**
   * 
   * @param sportId 
   * @param year 
   * @param category 
   * @param level 
   * @returns array of objects of type {"competitionId": number,"competition":string}
   */
  GetComptetionDDByFilter(sportId:number, year:number, category:string, level:string, isAgOg?:boolean):Observable<ICompetetionDD[]>{
    return <any>this._api.getACTC("Common/GetComptetionByFilter?sport="+ sportId + "&year=" + year + "&category=" + category + "&level=" + level + "&Is_AgOgCg=" + isAgOg )
  }

  GetComptetionByFilterLast2Year(sportId:number,year:number,category:string,level:string):Observable<ICompetetionDD[]>{
    return this._api.getACTC("Common/GetComptetionByFilter_Last2Year?sport="  + sportId + "&year=" + year + "&category=" + category + "&level=" + level)
  }

  GetComptetionDDByFilter2(sportsId:number,year:number,category:string,Is_AgOgCg:any ,level:string){
    return this._api.getACTC("Common/GetComptetionByFilter?sport="+sportsId+"&year="+year+"&Is_AgOgCg="+Is_AgOgCg+"&category="+category+"&level="+level)
  }

  GetCompetitionList(sport_detail_id:number,category?:string, tournament_level?:string,year?:number):Observable<IGetCompetitionList[]>{
    return this._api.getACTC("Common/GetCompetitionList?sport_detail_id="+sport_detail_id+"&age_category="+category+"&tournament_level="+tournament_level+"&year="+ year)
  }

  GetAthletebyNSRSId(kitID:string,sportId:number,gender:string){
    return this._api.getACTC("Common/GetAthletebyNSRSId?kitd_unique_id=" + kitID + "&sport=" + sportId +"&gender=" + gender)
  }

  GetComptetionDetails(competitionId:number):Observable<IGetComptetionDetails>{
    return this._api.getACTC("Common/GetComptetionDetails?Id=" + competitionId)
  }
  
  GetAgeGroupDD():Observable<IAgeCategoryDD[]>{
    return this._api.getACTC("Common/GetAgeGroupDD")
  }

  //service for submit final form in lats part (E-2)
  SubmitByNSF(user_id:number, year:number, sportId:number, role_id:number){
    return this._api.postACTC("FormSubmit/SubmitForm?user_id="+user_id+"&year="+year+"&sportId="+sportId+"&role_id="+role_id,{})
  }

  //common service for all sub component for check if the form is editable or not (CURD)
  FormSubmitFlowStatus(user_id:number,year:number, sportId:number, role_id:number):Observable<any>{
    return this._api.getACTC('FormSubmit/FlowStatus?user_id='+user_id+'&year='+year+'&sportId='+sportId+'&role_id='+role_id)
  }


  GetACTCList(Role_Id:number, User_Id:number):Observable<IGetACTCList[]>{
    return this._api.getACTC('Common/GetACTCList?Role_Id='+Role_Id+'&User_Id='+User_Id)
  }

  GetACTCList_for_Management(){
    return this._api.getACTC('Common/GetACTCList_for_Management')
  }

  SaveFormStatus(FormId:number,Fin_Yr:number,SportId:number):Observable<any>{
    return this._api.getACTC("Common/SaveFormStatus?FormId=" + FormId + "&Fin_Yr=" + Fin_Yr + "&SportId=" + SportId)
  }
}

export interface IGetACTCList {
  federation_Id: number
  federationName: string
  sport_name: string
  financialYear: string
  proposed_budget: number
  approved_budget: number
  final_status: string
  sport_detail_id: number
  currentUser:number
}


export type CompetetionList = ICompetetionDD[]

export interface ICompetetionDD {
  competitionId: number
  competition: string
}

interface ICommonForDD{
  id: number
  name: string
}

export interface IAgeCategoryDD extends ICommonForDD {}

export interface ICurrencyDD {
  id: number
  name: string
}


export type IStakeHolderList = IStakeHolderDD[]

export interface IStakeHolderDD {
  id: number
  name: string
}


// export type Root = IStateDD[]

export interface IStateDD {
  id: number
  name: string
}


// export interface IFormList {
//   formName: string
//   formDesc: string
//   categoryId: number
//   categoryName: string
//   sortOrder: number
//   isfilledby_nsf: boolean
// }

export interface IGetFormList {
  formList: IFormList[]
  formCategories: IFormCategory[]
}

export interface IFormList {
  form_Id: number
  formName: string
  formDesc: string
  categoryId: number
  categoryName: string
  sortOrder: number
  isfilledby_nsf: boolean
}

export interface IFormCategory {
  category_Id: number
  category_Name: string
  is_Eanble: boolean
  imgSrc:string
}


export interface IEquipmentDD {
  equipment_Id: number
  equipment_Name: string
  is_consumeable: boolean
}


export interface IGetCompetitionList {
  tournament_detail_id: number
  tournament_name: string
  tournament_level: string
  age_category: string
  tournament_year: number,
  is_AgOgCG: boolean
}

export interface IGetComptetionDetails {
  tournament_Id: number
  tournament_name: string
  edition: number
  year: number
  level: string
  category: string
  from_date: string
  to_date: string
  place: string
  country: string
  country_id: number
  state: string
  state_id: number
  city: string
  city_id: number
}

