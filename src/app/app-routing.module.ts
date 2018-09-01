import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';

import {CountryListComponent} from './pages/countryList/country-list/country-list.component';
import {MapComponent} from './pages/home/map/map.component';
import {CountryComponent} from './pages/countryEdit/country/country.component';
import {ResolverService} from './resolver.service';
import {HomeResolverService} from './pages/home/homeResolver.service';
import {CountryEditResolverService} from './pages/countryEdit/countryEditResolver.service';
import {LoginPageResolverService} from './pages/login/loginPageResolver.service';
import {LoginPageComponent} from './pages/login/login-page/login-page.component';
import {TraitManagementComponent} from './pages/customisation/trait-management/trait-management.component';
import {TraitManagementResolverService} from './pages/customisation/trait-management/traitManagementResolver.service';
import {MapItemTypeManagementComponent} from './pages/customisation/map-item-type-management/map-item-type-management.component';
import {MapItemTypeManagementResolverService} from './pages/customisation/map-item-type-management/mapItemTypeManagementResolver.service';
import {MapItemManagementComponent} from './pages/map-item-management/map-item-management.component';
import {MapItemManagementResolverService} from './pages/map-item-management/mapItemManagementResolver.service';
import {AboutUsComponent} from './pages/about-us/about-us.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MapComponent,
    resolve: {loader: HomeResolverService}},
  { path: 'login', component: LoginPageComponent,
    resolve: {loader: LoginPageResolverService}},
  { path: 'countries', component: CountryListComponent,
    resolve: {loader: ResolverService}
    // children: [
    //   { path: '', component: RecipeStartComponent },
    //   { path: 'new', component: RecipeEditComponent },
    //   { path: ':id', component: RecipeDetailComponent },
    //   { path: ':id/edit', component: RecipeEditComponent },
    // ]
  },
  { path: 'map-item-management', component: MapItemManagementComponent,
    resolve: {loader: MapItemManagementResolverService}
  },
  { path: 'about-us', component: AboutUsComponent
  },
  { path: 'country', component: CountryComponent,
    resolve: {loader: CountryEditResolverService} },
  { path: 'traitManagement', component: TraitManagementComponent,
    resolve: {loader: TraitManagementResolverService} },
  { path: 'mapItemTypeManagement', component: MapItemTypeManagementComponent,
    resolve: {loader: MapItemTypeManagementResolverService} },
  { path: 'states', component: CountryListComponent,
    children: [
      { path: '', component: CountryListComponent },
      { path: ':id', component: CountryListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
