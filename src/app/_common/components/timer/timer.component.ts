import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, range, scan, Subscription, takeUntil, takeWhile, timer } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnInit {

  unsubscribe:Subject<any> = new Subject()
  timeLeft: any
  @Output() dataFromTimer:any = new EventEmitter();
  subscription!:Subscription

  timer$:Observable<any> = timer(0, 1000).pipe(
    scan(acc => --acc,60),
    takeWhile(x => x >= 0),
    takeUntil(this.unsubscribe)
  )

  private ngUnsubscribe: Subject<any> = new Subject()

  constructor() {
  }
  

  ngOnInit() {
    this.subscription = this.StartTimer()
  }

  StartTimer(){
    return this.timer$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      console.log(response)
      this.timeLeft = response
      if(response == 0){
        this.dataFromTimer.emit(true)
      }
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
