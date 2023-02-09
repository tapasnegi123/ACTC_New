import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDateService } from 'src/app/_common/services/route-date.service';

@Component({
  selector: 'app-part-a',
  templateUrl: './part-a.component.html',
  styleUrls: ['./part-a.component.scss']
})
export class PartAComponent {

  constructor(private _activatedRoute:ActivatedRoute,private _routeDate:RouteDateService) {
    
  }

  ngOnInit(){
  
  }
}
