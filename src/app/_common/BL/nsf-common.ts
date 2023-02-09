// export function GetCompetitionListAgOg(masterarray:Array<any>,year:any,isAgOg:boolean):Array<any>{
//     let response:Array<any> = masterarray.filter(ele => ele.tournament_year == year && 
//         ele.tournament_level == 'International' && ele.is_AgOgCG == isAgOg)
//     return response    
// }

export class NsfCommonBL{

    GetCompetitionListAgOg(masterarray:Array<any>,year:any,isAgOg:boolean):Array<any>{
        return this.FilterArrayAgOg(masterarray,year,isAgOg)
    }

    private FilterArrayAgOg(masterarray:Array<any>,year:any,isAgOg:boolean):Array<any>{
        let response:Array<any> = masterarray.filter(ele => ele.tournament_year == year && 
            ele.tournament_level == 'International' && ele.is_AgOgCG == isAgOg)
        return response    
    }
}