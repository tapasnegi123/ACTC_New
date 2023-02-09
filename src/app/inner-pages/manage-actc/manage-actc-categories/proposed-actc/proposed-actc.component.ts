import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditableStatus } from 'src/app/_common/services/manage-actc/common.service';
import { IUserCredentials } from 'src/app/_common/services/storage.service';
import { INSFInfo } from '../../manage-actc-list/manage-actc-list.component';

@Component({
  selector: 'proposed-actc',
  templateUrl: './proposed-actc.component.html',
  styleUrls: ['./proposed-actc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposedActcComponent {
  @Input() userData!:IUserCredentials<any>
  @Input() year:any
  @Input() routeData!:INSFInfo

  btnTitleAndId = [
    { title: 'SENIOR', id: 1 },
    { title: 'JUNIOR', id: 2 },
    { title: 'JUNIOR DEVELOPMENT PROGRAM UNDER KHELO INDIA', id: 3},
    { title: 'COACHES/REFEREE DEVELOPMENT PLAN', id: 4},
  ];

  editable!:boolean
  ngOnInit(){
    this.editable = EditableStatus(this.userData.role_id,this.routeData.currentUser)
  }


  navButtonDefault: number = 1;
  ToggleSection(data: any) {
    this.navButtonDefault = data.id;
  }

  editMode:boolean = true
  ToggleEdit(){
    this.editMode = !this.editMode
  }

  @Output() dataFromChild:EventEmitter<any> = new EventEmitter()
  GoToPreviousSection(section:number){
    this.dataFromChild.emit(section)
  }


}

export interface IProposedACTCSummary{
  title:string,
  id:number
}