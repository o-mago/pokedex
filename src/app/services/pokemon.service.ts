import { Injectable } from '@angular/core';
import * as Pokedex from 'pokeapi-js-wrapper';
import {  PokedexListResults } from '../models/pokedexList';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokedex;

  constructor() { 
    this.pokedex = new Pokedex.Pokedex();
  }

  async getPokemonListByName(nameList: Array<string>, evol: boolean = false): Promise<any> {
    let pokemonList = await nameList.reduce(async function(acc: object, elem: PokedexListResults) {
      let result = await this.getPokemonByName(elem.name);
      let image = await this.getPokemonImage(result.id);
      let species = await this.getPokemonSpecies(elem.name);
      let evolResult = null;
      if(!evol) {
        let evolutionId = species.evolution_chain ? species.evolution_chain.url.match(/(?<=\/)[\d]+(?=\/)/)[0] : null;
        if(evolutionId) {
          let evolution = await this.getEvolutionById(evolutionId);
          let evolutionArray = this.getEvolution([evolution.chain], []);
          evolResult = await this.getPokemonListByName(evolutionArray, true);
        }
      }

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
        evolution: evolResult
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

  getEvolution(evolution, evolArray): Array<any> {
    evolution.forEach(elem => {
      evolArray.push({name: elem.species.name});
      if(elem.evolves_to && elem.evolves_to.length > 0) {
        evolArray = this.getEvolution(elem.evolves_to, evolArray);
      }
    })

    return evolArray;
  }

  async getPokemonSpecies(name: string) {
    return await this.pokedex.getPokemonSpeciesByName(name);
  }

  async getPokemonNamesList(): Promise<any> {
    var interval = {
      limit: 893,
      offset: 0
    }
    let list = await this.pokedex.getPokemonsList(interval);
    return list.results;
  }

  async getEvolutionById(id: number): Promise<any> {
    return await this.pokedex.getEvolutionChainById(id);
  }

  async getPokemonByName(name: string): Promise<any> {
    return await this.pokedex.getPokemonByName(name);
  }

  getPokemonImage(id: number): string {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${this.getPokemonNumber(id)}.png`;
  }

  getPokemonNumber(id: number): string {
    let fullId = ("000"+id).slice(-3);
    return fullId;
  }
}