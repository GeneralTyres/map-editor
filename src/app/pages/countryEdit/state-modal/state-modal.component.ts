import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StateService} from '../../../services/state.service';
import {TraitService} from '../../../services/trait.service';
import {BaseService} from '../../../services/base.service';
import {ReferenceWidgetComponent} from '../../shared-components/reference-widget/reference-widget.component';
import {ReferenceModel} from '../../../models/reference.model';

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
  @ViewChild(ReferenceWidgetComponent) refWid: ReferenceWidgetComponent;
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
    if (this.activeState.traits.length > 0) {
      this.selectedTraits = this.traitsService.getTraitsByIds(JSON.parse(this.activeState.traits));
      this.iconTraits = this.traitsService.getTraitsByIds(JSON.parse(this.activeState.traits));
    }
  }

  save() {
    this.refWid.saveReference().subscribe((value: ReferenceModel) => {
      this.activeState.referenceId = value.id;
      const traitIds = this.baseService.getPropertyValuesFromArray(this.selectedTraits, 'id');
      this.activeState.traits = JSON.stringify(traitIds);
      this.stateService.saveState(this.activeState).subscribe((state: any) => {
        this.activeModal.close(state);
      });
    });
  }

  onSelect() {
    const traitIds = this.baseService.getPropertyValuesFromArray(this.selectedTraits, 'id');
    this.iconTraits = this.baseService.getObjectsWherePropertyHasValues(this.traits, 'id', traitIds);
  }

}
