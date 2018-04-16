import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './services/data.service';
import {HeaderComponent} from './header.component';
import { CountryListComponent } from './country-list/country-list.component';
import {AppRoutingModule} from './app-routing.module';
import {CountryService} from './services/country.service';
import { StatesListComponent } from './states-list/states-list.component';
import {StateService} from './services/state.service';
import { CountryComponent } from './country/country.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MapService} from './services/map.service';
import {AreaService} from './services/area.service';
import {BaseService} from './services/base.service';
import { CountryMapComponent } from './country-map/country-map.component';
import {LoaderService} from './services/loader.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    CountryListComponent,
    StatesListComponent,
    CountryComponent,
    CountryMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    LoaderService,
    DataService,
    CountryService,
    StateService,
    MapService,
    AreaService,
    BaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
