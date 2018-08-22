import {Component, Input, OnInit} from '@angular/core';
import {ReferenceModel} from '../../../models/reference.model';
import {ReferenceService} from '../../../services/reference.service';
import {BaseService} from '../../../services/base.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReferenceTextModalComponent} from './reference-text-modal/reference-text-modal.component';

@Component({
  selector: 'app-reference-widget',
  templateUrl: './reference-widget.component.html',
  styleUrls: ['./reference-widget.component.css']
})
export class ReferenceWidgetComponent implements OnInit {
  private _referenceId: number;

  @Input() set referenceId(value: number) {
    this._referenceId = value;
    this.displayNewReference();
  }
  @Input() editMode: boolean;

  reference: ReferenceModel = new ReferenceModel();
  textReferenceList: any[] = [];

  constructor(private referenceService: ReferenceService,
              private baseService: BaseService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.displayNewReference();
  }

  displayNewReference() {
    if (this.baseService.isNotEmpty(this._referenceId) && this._referenceId !== 0) {
      this.loadReference();
    } else {
      this.reference = new ReferenceModel();
      if (this.editMode && this.textReferenceList.length === 0) {
        this.textReferenceList = [{text: ''}];
      }
    }
  }

  loadReference() {
    const id = this._referenceId;
    this.referenceService.loadReferenceById(id).then(
      ( value: ReferenceModel ) => {
        this.reference = value[0];
        this.textReferenceList = JSON.parse(this.reference.referenceText);
        if (this.editMode && this.textReferenceList.length === 0) {
          this.textReferenceList = [{text: ''}];
        }
      }
    );
  }

  /**
   * Adds a new input field for a reference
   */
  addTextReference() {
    this.textReferenceList.push({text: ''});
  }

  /**
   * Goes through the text references and removes the empty ones.
   */
  checkTextReferences() {
    for (let i = 0; i < this.textReferenceList.length; i++) {
      if (this.textReferenceList[i].text === '') {
        this.textReferenceList.splice(i, 1);
        i--;
      }
    }
  }

  saveReference() {
    this.checkTextReferences();
    this.reference.referenceText = JSON.stringify(this.textReferenceList);
    return this.referenceService.saveReference(this.reference);
  }

  showReferenceModal() {
    const modalRef = this.modalService.open(ReferenceTextModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.referenceList = this.textReferenceList;
    modalRef.result.then(value => {
      // Doen iets na toe maak
    });
  }

}
