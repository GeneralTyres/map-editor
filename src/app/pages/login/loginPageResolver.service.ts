import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {UsersService} from '../../services/users.service';

@Injectable()
export class LoginPageResolverService implements Resolve<any> {
  constructor(private userService: UsersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const promises = [];
    promises.push(this.userService.loadUsers());
    return Promise.all(promises).then( value => {

    });
  }
}
