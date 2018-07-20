import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { UserModel } from './models/users.model';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  activeUser = new UserModel();

  constructor(
    private router: Router,
    private userService: UsersService) {
    // Kyk vir as die route vernader
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.activeUser = this.userService.getActiveUser();
      }
    });
  }
}
