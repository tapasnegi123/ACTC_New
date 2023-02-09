import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, EMPTY, filter, fromEvent, map, Observable, OperatorFunction } from 'rxjs';
import { IApprovedACTC } from '../../interface/approved-actc.interface';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent implements OnInit {

  // @Input() dataList:Array<any> = []
  @Input() mockArr:Array<any> = []
  model:any

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.mockArr.map( (event:IApprovedACTC) => { return event.federationName}).filter((v:any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  constructor(private renderer:Renderer2) {
  }

  ngOnInit() {
  }

  // @ViewChild('typeahead') typeahead!:ElementRef
  @ViewChild('ngbtypeahead',{static:true}) ngbtypeahead!:NgbTypeahead
  ngAfterViewInit(){
    this.OnSelectItem()
    this.OnNullItem()
  }

  @Output() dataFromTypeahead:any = new  EventEmitter()
  @Output() dataIsEmpty:any = new  EventEmitter()
  OnSelectItem(){
    this.ngbtypeahead.selectItem.subscribe(event => {
      console.log(event)
      this.dataFromTypeahead.emit(event.item)
    })
  }

  OnNullItem(){
    this.ngbtypeahead.registerOnChange( event => {
      console.log(event)
      if(event == '' || event == null || event == " " ){
        console.log("search bar is empty")
        this.dataIsEmpty.emit(event)
      }
    })
  }


}
