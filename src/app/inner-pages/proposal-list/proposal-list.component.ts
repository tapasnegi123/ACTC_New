import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'proposal-list',
  template: `<router-outlet></router-outlet>`,
})
export class ProposalListComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(){

  }

  NavigateToIndivisual(){
    this._router.navigate(['proposal-list/ncc'])
  }

}
