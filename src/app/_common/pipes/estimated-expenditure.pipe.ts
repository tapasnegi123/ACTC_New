import { Pipe, PipeTransform } from "@angular/core";
import { differenceInCalendarDays, differenceInDays, differenceInHours, eachMonthOfInterval, endOfMonth, getDate, getDaysInMonth } from 'date-fns';
import { EMPTY } from "rxjs";

@Pipe({
    name:"expenditure"
})

export class EstimateExpenditurePipe implements PipeTransform{

    transform(fromDate:string, toDate:string, salaryPerMonth?:any) {
        let contractStartDate,contractEndDate, salary
        
        if(contractStartDate != (""||null) || contractEndDate != (""||null) || salaryPerMonth != (""||null)){
            contractStartDate = fromDate
            contractEndDate = toDate
            salary = parseInt(salaryPerMonth)
        }
    
        if(fromDate == "" || toDate == "" ){
            return ''            
        }else{
            const numberOfMonths = eachMonthOfInterval({
                start: new Date(fromDate),
                end: new Date(toDate)
            })
            console.log(numberOfMonths.length)

            let totalNumberOfMonths = numberOfMonths.length
            //To ignore DST and only measure exact 24-hour periods
            const totalDays = Math.floor(differenceInHours(new Date(toDate), new Date(fromDate))/24)|0 
            console.log(totalDays)

            let totalDaysInMonth = this.GetTotalDaysOfAllMonth(numberOfMonths)
            console.log(totalDaysInMonth)

            return parseFloat(this.GetEstimatedExpenditure(totalNumberOfMonths,salaryPerMonth,totalDays,totalDaysInMonth)) 
        }
    }

    CalculateEstimatedExpenditure(remainingDaysOfMonth:any,totalDaysInAMonth:any,salaryPerMonth:any){
        return  remainingDaysOfMonth * (salaryPerMonth / totalDaysInAMonth)
    }

    GetTotalDaysOfAllMonth(numberMonthArray:Array<any>){
        let daysinMonthArray:Array<any> = [] , result
        numberMonthArray.forEach( (element) => {
            let days = getDaysInMonth(element)
            daysinMonthArray.push(days)
        })
        result = daysinMonthArray.reduce( (a,b) => a + b,0)
        return result
    }

    GetEstimatedExpenditure(numberOfMonths:number,salary:number,totalWorkingDays:number,totalNumberOfDaysInMonth:number){
        return ((totalWorkingDays / totalNumberOfDaysInMonth) * (salary * numberOfMonths)).toFixed(2)
    }

}