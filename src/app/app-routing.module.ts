import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CountryListComponent} from './country-list/country-list.component';
import {MapComponent} from './map/map.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', component: MapComponent },
  { path: 'countries', component: CountryListComponent,
    // children: [
    //   { path: '', component: RecipeStartComponent },
    //   { path: 'new', component: RecipeEditComponent },
    //   { path: ':id', component: RecipeDetailComponent },
    //   { path: ':id/edit', component: RecipeEditComponent },
    // ]
  },
  { path: 'states', component: CountryListComponent,
    children: [
      { path: '', component: CountryListComponent },
      { path: ':id', component: CountryListComponent },
    ]
  },
  // { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
