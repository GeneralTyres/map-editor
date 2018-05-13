import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

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


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    CountryListComponent,
    CountryComponent,
    CountryMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    LoadingBarHttpClientModule
  ],
  providers: [
    DataService,
    CountryService,
    StateService,
    MapService,
    AreaService,
    BaseService,
    // Resolvers
    ResolverService,
    HomeResolverService,
    CountryEditResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
