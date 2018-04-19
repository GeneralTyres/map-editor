import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


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
import {LoaderService} from './services/loader.service';
import {ResolverService} from './resolver.service';


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
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    LoaderService,
    DataService,
    CountryService,
    StateService,
    MapService,
    AreaService,
    BaseService,
    ResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
