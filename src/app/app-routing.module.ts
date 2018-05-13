import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';

import {CountryListComponent} from './pages/countryList/country-list/country-list.component';
import {MapComponent} from './pages/home/map/map.component';
import {CountryComponent} from './pages/countryEdit/country/country.component';
import {ResolverService} from './resolver.service';
import {HomeResolverService} from './pages/home/homeResolver.service';
import {CountryEditResolverService} from './pages/countryEdit/countryEditResolver.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', component: MapComponent,
    resolve: {homeLoader: HomeResolverService}},
  { path: 'countries', component: CountryListComponent,
    resolve: {loader: ResolverService}
    // children: [
    //   { path: '', component: RecipeStartComponent },
    //   { path: 'new', component: RecipeEditComponent },
    //   { path: ':id', component: RecipeDetailComponent },
    //   { path: ':id/edit', component: RecipeEditComponent },
    // ]
  },
  { path: 'country', component: CountryComponent,
    resolve: {loader: CountryEditResolverService} },
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
