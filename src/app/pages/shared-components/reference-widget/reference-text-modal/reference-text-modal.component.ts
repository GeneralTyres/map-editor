import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reference-text-modal',
  templateUrl: './reference-text-modal.component.html',
  styleUrls: ['./reference-text-modal.component.css']
})
export class ReferenceTextModalComponent implements OnInit {
  @Input() referenceList;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log('this.referenceList ::', this.referenceList);
  }

}
