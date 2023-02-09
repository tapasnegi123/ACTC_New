import { FormArray } from "@angular/forms";
import differenceInHours from "date-fns/differenceInHours";
import Swal from "sweetalert2";

export function FinYearDateValidation(formArrayControls: FormArray, index: number, FromDateControl: string, ToDateControl: string) {
  let fromDate = formArrayControls.controls[index].get(FromDateControl)?.value
  let toDate = formArrayControls.controls[index].get(ToDateControl)?.value
  let diff = DateDifference(fromDate, toDate);
  if (diff < 0) {
    ShowWarning("Invalid date", 0, "Date is out of range", true).then(response => {
      console.log(response)
    })
    formArrayControls.controls[index].get(FromDateControl)?.patchValue('')
    formArrayControls.controls[index].get(FromDateControl)?.markAsTouched()
    formArrayControls.controls[index].get(ToDateControl)?.patchValue('')
    formArrayControls.controls[index].get(ToDateControl)?.markAsTouched()


    // formArrayControls.controls[index].get([FromDateControl,ToDateControl])?.patchValue('')
    // formArrayControls.controls[index].get([FromDateControl,ToDateControl])?.markAsTouched()
  }
}


export function DateDifference(fromDate: any, toDate: any) {
  if (fromDate == "" || toDate == "") {
    return ""
  } else {
    return Math.floor(differenceInHours(new Date(toDate), new Date(fromDate)) / 24) | 0
  }
}

export function ShowWarning(title: string, timer?: number, body?: string, showConfirmButton?: boolean, confirmBtnText?: string) {
  return Swal.fire({
    html: "<b>" + body + "</b>",
    position: 'center',
    title: title + '!',
    showConfirmButton: showConfirmButton ? showConfirmButton : false,
    confirmButtonColor: "#1f91c0",
    confirmButtonText: confirmBtnText ? confirmBtnText : 'Ok',
    timer: timer,
    width: 600,
    heightAuto: false
  });
}

export function confirmDelete(index: number, type: string, formArrayName: FormArray) {
  Swal.fire({
    title: 'Are you sure you want to delete this entry?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm'
  }).then((result) => {
    if (result.isConfirmed) {
      if (type == 'first') formArrayName.removeAt(index);
      Swal.fire(
        'Saved!',
        'Deleted successfully.',
        'success'
      )
    }
  })
}


export function ditinctEvents(ManageEventDetails: any, checkedEvents: any) {
  let distinctEvent: any = []
  let a = ManageEventDetails
  let b = checkedEvents
  let idsOfA: any = [];
  let idsOfB: any = []
  a.forEach((item: any) => idsOfA.push(item.event_id))
  b.forEach((item: any) => idsOfB.push(item.event_Id))
  let filteredArray = idsOfA.filter((e: any) => idsOfB.indexOf(e) < 0);
  a.forEach((item: any) => {
    filteredArray.forEach((element: any) => {
      if (item.event_id == element) {
        distinctEvent.push(item)
      }
    })
  })
  return distinctEvent
}