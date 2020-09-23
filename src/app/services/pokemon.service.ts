import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Pokedex from 'pokeapi-js-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  // URL which returns list of JSON items (API end-point URL)
  // private readonly URL = 'https://pokeapi.co/api/v2';
  private pokedex;

  constructor() { 
    this.pokedex = new Pokedex.Pokedex();
  }

  // create a method named: resolveItems()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object
  async getPokemonList(limit: number, offset: number): Promise<any> {
    console.log('Request is sent!');
    var interval = {
      limit: limit,
      offset: offset
    }
    return await this.pokedex.getPokemonsList(interval)
      .then(function(response: object) {
        return response;
      });
  }

  getPokemonListByUrl(url: string): Promise<any> {
    let param = url.match(/(?<==)[\d]+/g);
    return this.getPokemonList(parseInt(param[0]), parseInt(param[1]));
  }

  // getPokemonInfo():  {
  //   console.log('Request is sent!');
  //   return this.http.get(this.URL);
  // }
}