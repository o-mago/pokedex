import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Pokedex from 'pokeapi-js-wrapper';
import { PokedexList, PokedexListResults } from '../models/pokedexList';
import { Pokemon } from '../models/pokemon';
import { types } from 'util';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokedex;

  constructor() { 
    this.pokedex = new Pokedex.Pokedex();
  }

  async getPokemonList(limit: number, offset: number): Promise<any> {
    var interval = {
      limit: limit,
      offset: offset
    }
    let list = await this.pokedex.getPokemonsList(interval);
    let pokemonList = await list.results.reduce(async function(acc: object, elem: PokedexListResults) {
      let result = await this.getPokemonByName(elem.name);
      let image = await this.getPokemonImage(result.id);
      let stats = result.stats.filter(stat => {
        return stat.stat.name === "hp" || stat.stat.name === "attack" || stat.stat.name === "defense" || stat.stat.name === "speed";
      });
      let poke = {
        id: result.id,
        number: this.getPokemonNumber(result.id),
        name: result.name,
        viewName: result.name.charAt(0).toUpperCase() + result.name.slice(1),
        types: result.types,
        stats: stats,
        height: result.height,
        image: image,
      }
      let newAcc = await acc;
      if(newAcc["data"] && newAcc["data"].length > 1 && poke.id !== newAcc["data"][newAcc["data"].length-1].id+1) {
        newAcc["next"] = false;
        return newAcc;
      }
      if(newAcc["data"] && newAcc["data"].length > 1 && poke.id < newAcc["data"][newAcc["data"].length-1].id) {
        console.log("usahudhasudhsau")
        return acc;
      }
      if(!acc["data"]) {
        acc["data"] = [];
      }
      newAcc["data"].push(poke);
      return newAcc;
    }.bind(this), {next: true});
    return Promise.resolve(pokemonList);
  }

  async getPokemonListByName(nameList: Array<string>): Promise<any> {
    let pokemonList = await nameList.reduce(async function(acc: object, elem: PokedexListResults) {
      let result = await this.getPokemonByName(elem.name);
      let image = await this.getPokemonImage(result.id);
      let stats = result.stats.filter(stat => {
        return stat.stat.name === "hp" || stat.stat.name === "attack" || stat.stat.name === "defense" || stat.stat.name === "speed";
      });
      let poke = {
        id: result.id,
        number: this.getPokemonNumber(result.id),
        name: result.name,
        viewName: result.name.charAt(0).toUpperCase() + result.name.slice(1),
        types: result.types,
        stats: stats,
        height: result.height,
        image: image,
      }
      let newAcc = await acc;
      if(!acc["data"]) {
        acc["data"] = [];
      }
      newAcc["data"].push(poke);
      return newAcc;
    }.bind(this), {});
    return Promise.resolve(pokemonList);
  }

  async getPokemonNamesList(): Promise<any> {
    var interval = {
      limit: 893,
      offset: 0
    }
    let list = await this.pokedex.getPokemonsList(interval);
    console.log(list);
    return list.results;
  }

  // getPokemonListByUrl(url: string): Promise<any> {
  //   let param = url.match(/(?<==)[\d]+/g);
  //   return this.getPokemonList(parseInt(param[0]), parseInt(param[1]));
  // }

  async getPokemonByName(name: string): Promise<any> {
    return await this.pokedex.getPokemonByName(name);
  }

  async getEvolution(id: number): Promise<any> {
    return await this.pokedex.getEvolutionChainById(id);
  }

  getPokemonImage(id: number): string {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${this.getPokemonNumber(id)}.png`;
  }

  getPokemonNumber(id: number): string {
    let fullId = ("000"+id).slice(-3);
    return fullId;
  }
}