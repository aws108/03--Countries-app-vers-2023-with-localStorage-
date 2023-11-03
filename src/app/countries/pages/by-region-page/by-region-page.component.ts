import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/region.type';

// type Region = 'Africa'| 'Americas'|'Asia'|'Europe'|'Oceania'; //1

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: [
  ]
})
export class ByRegionPageComponent implements OnInit{

  countries: Country[] = [];
  regions: Region[] = ['Africa', 'Americas','Asia','Europe','Oceania'];
  selectedRegion?: Region;

  constructor( private countriesService: CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byRegion.countries;
    this.selectedRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchByRegion( region: Region ):void  {
    this.selectedRegion = region;

    this.countriesService.searchRegion( region )
      .subscribe( countries => {
        this.countries = countries;
      });

  }

}


// 1-> Usa typer cuando siempre van a ser los mismos elementos