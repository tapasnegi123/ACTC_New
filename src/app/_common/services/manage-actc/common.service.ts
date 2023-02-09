
/**
 * If nfs status is approved DO will not be able to edit anything. vice versa
 * @param roledId 
 * @param currentUser 
 * @returns boolean 
 */
export function  EditableStatus(roledId:number, currentUser:number){
    return (roledId  == currentUser) ? true : false
}
