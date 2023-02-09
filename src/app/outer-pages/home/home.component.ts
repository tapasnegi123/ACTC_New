import { Component, OnInit } from '@angular/core';

declare var Digio:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
  

  VerifyData()
  {
      console.log("Hi");
      let options =
      {
          environment: "sandbox",
                  callback: function (response:any) {
              if (response.hasOwnProperty("error_code"))
              {
                  console.log(response)
                  return console.log("error occurred in process");
              }else{

              }
              console.log("Signing completed successfully");
          },
          logo: "https://sportsauthorityofindia.gov.in/sai/assets/frontend/images/SAI_footer_logo.svg",
             
  
      }
  
      let x = new Digio(options);
      x.init();

      var y = x.submit("DID2302032310366565TCJX4EV989DK9","prashantvashishth.90@gmail.com","GWT230203231037088TNXPLSP26LWMJR" );
  }



  
}


