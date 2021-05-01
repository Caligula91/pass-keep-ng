import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pin-enter',
  templateUrl: './pin-enter.component.html',
  styleUrls: ['./pin-enter.component.css']
})
export class PinEnterComponent implements OnInit {

  @ViewChild('pinInput') pinInput!: ElementRef;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.pinInput.nativeElement.focus();
    }, 200)
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.activeModal.close(form.value);
    } 
  }

}
