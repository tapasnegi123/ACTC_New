import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { RouteDateService } from 'src/app/_common/services/route-date.service';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-a-home',
  templateUrl: './a-home.component.html',
  styleUrls: ['./a-home.component.scss']
})
export class AHomeComponent {

  constructor(private _router:Router, private _localStorage:StorageService){

  }

  year:any
  ngOnInit(){
    this.year = this._localStorage.GetYear
  }

  NavigateToSectionOne(){
    this._router.navigate(["/nsf-forms/"+this.year+"/part-a/section-1"])
  }

  @ViewChild("navTiles") navTiles!:ElementRef

  ngAfterViewInit(){

  }

}
