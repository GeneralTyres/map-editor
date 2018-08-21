import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {DataService} from './data.service';
import {UserModel} from '../models/users.model';
import {Router} from '@angular/router';

@Injectable()
export class UsersService {

  constructor(private data: DataService,
              private base: BaseService,
              private router: Router) { }

  users: UserModel[];
  activeUser = new UserModel();

  loadUsers() {
    return new Promise((resolve, reject) =>
      this.data.load('users', 0, null).subscribe(
        (value: UserModel[]) => {
          this.users = value;
          resolve();
        }
      ));
  }

  saveUser(area) {
    if (area.id) {
      return this.data.update('users', area);
    } else {
      return this.data.create('users', area);
    }
  }

  login(userName: string, password: string) {
    let userFound = false;
    for (let i = 0; i < this.users.length; i++) {
      if (userName === this.users[i].userName && password === this.users[i].password) {
        userFound = true;
        this.setActiveUser(this.users[i]);
      }
    }
    if (userFound) {
      this.router.navigate(['home']);
    }
  }

  setActiveUser(user: UserModel) {
    sessionStorage.setItem('activeUser', JSON.stringify(user));
    this.activeUser = user;
  }

  getActiveUser() {
    return this.activeUser;
  }
}
