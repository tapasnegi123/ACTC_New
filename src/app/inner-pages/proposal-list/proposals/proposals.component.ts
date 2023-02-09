import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss']
})
export class ProposalsComponent {

  constructor(private _router:Router) { }

  ngOnInit(){

  }

  NavigateToIndivisual(){
    this._router.navigate(['proposal-list/ncc'])
  }
  
}
