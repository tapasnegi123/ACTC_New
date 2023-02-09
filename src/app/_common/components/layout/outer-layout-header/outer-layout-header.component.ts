import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outer-layout-header',
  templateUrl: './outer-layout-header.component.html',
  styleUrls: ['./outer-layout-header.component.scss']
})
export class OuterLayoutHeaderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  NavigateToLogin(){
    this.router.navigate(['login'])
    console.log("NavigateToLogin is clicked. Please navigate")
  }

  // @ViewChild("navBarCollapse") navBarCollapse:any
  navBarCollapse:any
  NavbarToggle(){
    this.navBarCollapse
    console.log('navbar toggle is clicked')
  }

}
