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


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    CountryListComponent,
    StatesListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    DataService,
    CountryService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
