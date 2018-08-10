import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StateService} from '../../../services/state.service';
import {TraitService} from '../../../services/trait.service';
import {BaseService} from '../../../services/base.service';

@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styleUrls: ['./state-modal.component.css']
})
export class StateModalComponent implements OnInit {
  traits = [];
  selectedTraits = [];
  iconTraits = [];
  dropdownSettings = {};

  @Input() activeState;
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
              private baseService: BaseService,
              private stateService: StateService,
              private traitsService: TraitService) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.traits = this.traitsService.getTraits();
    console.log('this.traits ::', this.traits)
    console.log('this.activeState ::', this.activeState)
    if (this.activeState.traits.length > 0) {
      this.selectedTraits = this.traitsService.getTraitsByIds(JSON.parse(this.activeState.traits));
      this.iconTraits = this.traitsService.getTraitsByIds(JSON.parse(this.activeState.traits));
    }
  }

  save() {
    const traitIds = this.baseService.getPropertyValuesFromArray(this.selectedTraits, 'id');
    this.activeState.traits = JSON.stringify(traitIds);
    console.log('this.activeState ::', this.activeState)
    this.stateService.saveState(this.activeState).subscribe((state: any) => {
      this.activeModal.close(state);
    });
  }

  onSelect() {
    const traitIds = this.baseService.getPropertyValuesFromArray(this.selectedTraits, 'id');
    this.iconTraits = this.baseService.getObjectsWherePropertyHasValues(this.traits, 'id', traitIds);
  }

}
