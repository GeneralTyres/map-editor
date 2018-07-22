import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  userName = '';
  password = '';

  constructor(private userService: UsersService) { }

  ngOnInit() {

  }

  login() {
    this.userService.login(this.userName, this.password);
  }

}
