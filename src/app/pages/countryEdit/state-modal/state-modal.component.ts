import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styleUrls: ['./state-modal.component.css']
})
export class StateModalComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  @Input() activeState;
  economyOptions = [
    {
      name: 'Good',
      id: 0
    },
    {
      name: 'Bad',
      id: 1
    },
    {
      name: 'Steadfast',
      id: 2
    }
  ];
  humanSubTypesOptions = [
    {
      name: 'White',
      id: 0
    },
    {
      name: 'Black',
      id: 1
    },
    {
      name: 'Chines',
      id: 2
    }
  ];
  populationOptions = [
    {
      name: 'White',
      id: 0
    },
    {
      name: 'Black',
      id: 1
    },
    {
      name: 'Chines',
      id: 2
    }
  ];

  constructor(public activeModal: NgbActiveModal,
              private stateService: StateService) { }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  save() {
    this.stateService.saveState(this.activeState).subscribe((state: any) => {
      this.activeModal.close(state);
    });
  }

}
