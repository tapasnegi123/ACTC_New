import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { GenerateCaptchaService } from '../../services/generate-captcha.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaptchaComponent implements OnInit {

  @Output() dataFromCaptchaComponent:any = new EventEmitter()

  constructor(private _generateCaptcha:GenerateCaptchaService, private _rendere:Renderer2) { }

  ngOnInit() {
    this.genImgcap()
  }

  // @ViewChild("capCan") capCan!:ElementRef
  genImgcap(){
  let captcha
   captcha = this._generateCaptcha.CreateCaptcha()
  //  console.log("captcha component " + captcha)
   let canvas:any = document.getElementById("capCan");
   //style section
   let ctx = canvas.getContext("2d");
   ctx.font = "30px Arial";
   ctx.clearRect(0, 0, 240, 60);
   ctx.textAlign = "center";
   ctx.fillText(captcha, 140, 35);
   canvas.oncontextmenu = function() {return false};

   this.dataFromCaptchaComponent.emit(captcha)
  }

  newGenImg(){
    return this._generateCaptcha.CreateCaptcha()
    // return this._generateCaptcha.RefreshCaptcha()
  }

}
