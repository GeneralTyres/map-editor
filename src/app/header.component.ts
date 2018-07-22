import { Component } from '@angular/core';
import { UsersService } from './services/user.service';
import { UserModel } from './models/users.model';
import { NavigationEnd, Router } from '@angular/router';
import {sequenceEqual} from 'rxjs/internal/operators';
import {BaseService} from './services/base.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  activeUser = new UserModel();

  constructor(
    private baseService: BaseService,
    private router: Router,
    private userService: UsersService) {
    // Kyk vir as die route vernader
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const storedUser = JSON.parse(sessionStorage.getItem('activeUser'));
        if (this.baseService.isNotEmpty(storedUser)) {
          this.activeUser = storedUser;
        }
      }
    });
  }
}
