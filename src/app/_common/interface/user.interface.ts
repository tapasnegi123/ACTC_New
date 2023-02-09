export interface IUser {
    user_id:number,
    user_name:string,
    name:string,
    email_id:string,
    role_id:number,
    role_name:string,
    isStakeHolder:boolean,
    login_password:string | undefined | null,
    totalUser:number,
    isPasswordValidated:boolean,
    isOtpValidated:boolean,
    token:string,
    isSuperAdminn:boolean
}