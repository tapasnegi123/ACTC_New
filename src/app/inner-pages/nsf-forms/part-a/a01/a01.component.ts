import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { StorageService } from 'src/app/_common/services/storage.service';

@Component({
  selector: 'app-a01',
  templateUrl: './a01.component.html',
  styleUrls: ['./a01.component.scss']
})
export class A01Component implements OnInit,OnDestroy {

  year:any
  constructor(private _localStorage:StorageService,private _router:Router,
    private _renderer:Renderer2,private _activatedRoute:ActivatedRoute){

  }

  ngOnInit():void{
    this.year = this._localStorage.GetYear
  }

  ngOnDestroy(): void {
    
  }

  @ViewChild("home")home!:ElementRef
  ngAfterViewInit():void{
    this._renderer.listen(this.home.nativeElement,"click",(resp) => {
      this.NavigateToAHome()
    })
  }

  NavigateToAHome(){
    this._router.navigate(["/nsf-forms/"+this.year+"/part-a/home"])
    // this._router.routeReuseStrategy
  }
}
