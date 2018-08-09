import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { MapComponent } from './pages/home/map/map.component';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './services/data.service';
import {HeaderComponent} from './header.component';
import { CountryListComponent } from './pages/countryList/country-list/country-list.component';
import {AppRoutingModule} from './app-routing.module';
import {CountryService} from './services/country.service';
import {StateService} from './services/state.service';
import { CountryComponent } from './pages/countryEdit/country/country.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MapService} from './services/map.service';
import {AreaService} from './services/area.service';
import {BaseService} from './services/base.service';
import { CountryMapComponent } from './country-map/country-map.component';
import {ResolverService} from './resolver.service';
import {HomeResolverService} from './pages/home/homeResolver.service';
import {CountryEditResolverService} from './pages/countryEdit/countryEditResolver.service';
import { CountryDashboardComponent } from './pages/home/country-dashboard/country-dashboard.component';
import {TerritoryService} from './services/territory.service';
import {LeafletService} from './services/leaflet.service';
import { TerritoryModalComponent } from './pages/countryEdit/territory-modal/territory-modal.component';
import { StateModalComponent } from './pages/countryEdit/state-modal/state-modal.component';
import {UsersService} from './services/user.service';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import {LoginPageResolverService} from './pages/login/loginPageResolver.service';
import { TraitManagementComponent } from './pages/customisation/trait-management/trait-management.component';
import {TraitService} from './services/trait.service';
import {TraitManagementResolverService} from './pages/customisation/trait-management/traitManagementResolver.service';
import {SafeHtml} from './pipes/safeHtml.pipe';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    CountryListComponent,
    CountryComponent,
    CountryMapComponent,
    CountryDashboardComponent,
    TerritoryModalComponent,
    StateModalComponent,
    LoginPageComponent,
    TraitManagementComponent,
    SafeHtml
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingBarHttpClientModule,
    AngularFontAwesomeModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    ColorPickerModule,
    QuillModule
  ],
  providers: [
    DataService,
    CountryService,
    StateService,
    MapService,
    AreaService,
    BaseService,
    TerritoryService,
    LeafletService,
    UsersService,
    TraitService,
    // Resolvers
    ResolverService,
    HomeResolverService,
    CountryEditResolverService,
    LoginPageResolverService,
    TraitManagementResolverService
  ],
  bootstrap: [AppComponent],
  entryComponents: [TerritoryModalComponent, StateModalComponent]
})
export class AppModule { }
