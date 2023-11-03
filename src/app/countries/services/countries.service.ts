import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map, delay, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  cacheStore: CacheStore = {
    byCapital: {term: '', countries: []},// 1
    byCountries: {term: '', countries: []},
    byRegion: {region: '', countries: []},
  };

  constructor(private http: HttpClient ) { 
    this.loadFromLocalStorage();
  }


  // Añadir info al localStorage: 
  private saveToLocalStorage(){ //4
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore)); //3
  }
  private loadFromLocalStorage(){
    if (!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStorage')!);
  }
  ////////////////////////////////


  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError( () => of([])), // en caso de error, devuelve un array vacío
        // delay (2000),
      );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {

    const url = `${ this.apiUrl }/alpha/${ code }`;

    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ), // extrae el primer país o nulo
        catchError( () => of(null) )
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore.byCapital = { //2
          term: term,
          countries: countries,
        };
        this.saveToLocalStorage();
      })
    );
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore.byCountries = { //2
          term: term,
          countries: countries,
        };
        this.saveToLocalStorage();
      })
    );
  }

  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore.byRegion = { //2
          region: region,
          countries: countries
        };
        this.saveToLocalStorage();
      })
    );
  }
  


}


// 1-> Se usará para mantener los datos en la páguna aunque se cambie a otra (pasar de región a capital), para persistir la data.
// Guardarás el término de la búsqueda y la lista de países atribuida a esa búsqueda
// 2-> Tranformas los datos del get y guardas los datos del resultado en el objeto que tenías creado
// 3-> Guardas los resultados de las búsquedas en el localStorage
// 4-> Lo llamarás cada vez que hagas una modificación. Debes crear un observable que esté pendiente de lso cambios en cacheStore, pero aquí se hace con un tap
// 5-> cada vez que se haga la búsqueda, se guarda en el localStorage