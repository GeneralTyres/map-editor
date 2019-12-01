import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../services/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PathModalComponent} from './path-modal/path-modal.component';
import {PathModel} from '../../models/path.model';
import {PathService} from '../../services/path.service';

let self;

@Component({
  selector: 'app-path-management',
  templateUrl: './path-management.component.html',
  styleUrls: ['./path-management.component.css']
})
export class PathManagementComponent implements OnInit {

  paths: PathModel[] = [];
  displayedPaths: PathModel[] = [];
  searchText = '';

  constructor(private pathService: PathService,
              private route: ActivatedRoute,
              private router: Router,
              private baseService: BaseService,
              private modalService: NgbModal) {
    self = this;
  }

  ngOnInit() {
    const user = sessionStorage.getItem('activeUser');
    if (!this.baseService.isNotEmpty(user)) {
      this.router.navigate(['home']);
    }
    this.getData();
  }

  search() {
    this.displayedPaths = this.paths.filter(this.searchFilter);
  }

  searchFilter(path) {
    if (self.searchText === '') {
      // searchText is empty, display all
      return true;
    } else if (self.searchText !== undefined) {
      // searchText is not empty, filter on names and alternative names
      if (path.name.toLowerCase().indexOf(self.searchText.toLowerCase()) > -1) {
        // match found for flowMeter name
        return true;
      }
    }
    // no match found
    return false;
  }

  getData() {
    this.paths = this.pathService.getPaths();
    console.log('this.paths ::', this.paths);
    this.displayedPaths = this.baseService.alphaNumericSort(this.paths, 'name');
  }

  // Dashboard
  // goToCountry(country) {
  //   this.countryService.setActiveCountry(country);
  //   this.router.navigate(['country']);
  // }

  /**
   * Brings up the modal to create a new country. The country object is saved in the modal component and the result is
   * returned as value. The new map item is then added to the list.
   */
  createNewPath() {
    const modalRef = this.modalService.open(PathModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activePath = new PathModel();
    modalRef.result.then((value: PathModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        this.paths.push(value);
        // this.countryService.setActiveCountry(value);
        // this.router.navigate(['country']);
      }
    });
  }

  editPath(path) {
    let creating = false;
    if (!this.baseService.isNotEmptyOrZero(path.id)) {
      creating = true;
    }
    const modalRef = this.modalService.open(PathModalComponent, { size: 'lg', beforeDismiss: () => false });
    modalRef.componentInstance.activePath = path;
    modalRef.result.then((value: PathModel) => {
      if (this.baseService.isNotEmpty(value)) {
        // Doen iets na save
        if (creating) {
          this.paths.push(value);
        }
      }
    });
  }

  deleteItem(path) {
    this.pathService.detelePath(path).subscribe( value => {
      for (let i = 0; i < this.paths.length; i++) {
        if (this.paths[i].id === path.id) {
          this.paths.splice(i, 1);
          self.filter();
        }
      }
    });
  }

}
