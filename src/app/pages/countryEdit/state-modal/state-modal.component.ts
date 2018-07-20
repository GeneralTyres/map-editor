import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styleUrls: ['./state-modal.component.css']
})
export class StateModalComponent implements OnInit {

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
  }

  save() {
    this.stateService.saveState(this.activeState).subscribe((state: any) => {
      this.activeModal.close(state);
    });
  }

}
