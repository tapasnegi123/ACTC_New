export interface IForgotPassword<T>{
    userId?:number,
    name?:string,
    username?:string,
    emailId?:string,
    mask_emailId?:string,
    mobileNo?:string,
    mask_mobileNo?:string,
    multipleExist?:boolean,
    otpGeneratedId?:number
}