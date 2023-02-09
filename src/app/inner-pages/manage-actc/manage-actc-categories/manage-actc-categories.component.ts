import { EncryptionService } from 'src/app/_common/services/encryption.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { StorageService } from 'src/app/_common/services/storage.service';
import { ManageActcState } from 'src/app/_common/services/manage-actc/manage-actc.state';

@Component({
  selector: 'manage-actc-categories',
  templateUrl: './manage-actc-categories.component.html',
  styleUrls: ['./manage-actc-categories.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ManageActcCategoriesComponent implements OnInit {

  @Input() userData:any
  @Input() year:any

  routeData:any
  constructor(private _activatedRoute:ActivatedRoute,private _encrypt:EncryptionService,private _localStorage:StorageService,
    private manageActcState:ManageActcState) {
    console.log(this._localStorage.GetNsfInfo())

    console.log(this.manageActcState)

    this.routeData = JSON.parse(this._encrypt.decryptionAES(this._activatedRoute.snapshot.queryParams['data']))
    this.year =  parseInt(this.routeData.financialYear)
    this.userData = this._localStorage.GetUserAllCredentials()
    console.log(this.userData)
  }

  // btnOptions: any = [
  //   {
  //     btnName: 'PRESENT PERFORMANCE',
  //     btnId: 1,
  //     imgSrc: '/assets/images/Present-Performance.svg',
  //     link:'present-performance'
  //   },
  //   {
  //     btnName: 'FUNDING PATTERN IN ACTC',
  //     btnId: 2,
  //     imgSrc: '/assets/images/funding-pattern.svg',
  //     link:'funding-pattern'
  //   },
  //   {
  //     btnName: 'KRA & MILESTONES',
  //     btnId: 3,
  //     imgSrc: '/assets/images/flag-2-fill.svg',
  //     link:'kra-milestones'
  //   },
  //   {
  //     btnName: 'BUDGET SYNOPSIS',
  //     btnId: 4,
  //     imgSrc: '/assets/images/medal-line.svg',
  //     link:'budget-synopsis'
  //   },
  //   {
  //     btnName: 'PROPOSED ACTC',
  //     btnId: 5,
  //     imgSrc: '/assets/images/file-chart-line (1).svg',
  //     link:'proposed-actc'
  //   },
  // ];

  btnOptions: any = [
    {
      btnName: 'PRESENT PERFORMANCE',
      btnId: 1,
      imgSrc: '/assets/images/Present-Performance.svg',
      // link:'present-performance'
    },
    {
      btnName: 'FUNDING PATTERN IN ACTC',
      btnId: 2,
      imgSrc: '/assets/images/funding-pattern.svg',
      // link:'funding-pattern'
    },
    {
      btnName: 'KRA & MILESTONES',
      btnId: 3,
      imgSrc: '/assets/images/flag-2-fill.svg',
      // link:'kra-milestones'
    },
    {
      btnName: 'BUDGET SYNOPSIS',
      btnId: 4,
      imgSrc: '/assets/images/medal-line.svg',
      // link:'budget-synopsis'
    },
    {
      btnName: 'PROPOSED ACTC',
      btnId: 5,
      imgSrc: '/assets/images/file-chart-line (1).svg',
      // link:'proposed-actc'
    },
  ];
  
  section: number = 1;

  ngOnInit(): void {
    this.userData = this._localStorage.GetUserAllCredentials()
  }

  ToggleTemplate(data:any){
    // console.log(data)
    this.section = data
  }

}
