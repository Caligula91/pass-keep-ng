import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card-choice',
  templateUrl: './card-choice.component.html',
  styleUrls: ['./card-choice.component.css']
})
export class CardChoiceComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
