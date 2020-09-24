import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { PokemonRes } from './models/pokemonRes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pokemon = {} as PokemonRes;
  pokemons: PokemonRes[];
  page: number = 0;
  perPage: number = 12;
  next: boolean = true;
  namesList: Array<string>;
  filter: string;
  filteredList: Array<string>;
  pagList: Array<string>;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.getPokemonList(this.perPage, this.perPage*this.page).then(result => {
      this.pokemons = result.data;
    });
    this.getPokemonNamesList().then(result => {
      this.namesList = result;
      // this.filterName();
    });
  }

  filterName() {
    this.filteredList = this.namesList.filter(elem => elem["name"].includes(this.filter));
    if(this.filteredList.length > this.perPage) {
      this.pagList = this.filteredList.slice(this.perPage*this.page, this.perPage*this.page+this.perPage);
    } else {
      this.pagList = this.filteredList;
    }
    if(this.pagList[this.pagList.length-1]["id"] === this.filteredList[this.filteredList.length-1]["id"]) {
      this.next = false;
    }
    console.log(this.filteredList);
    this.pokemonService.getPokemonListByName(this.pagList).then(result => {
      console.log(result);
      this.pokemons = result.data;
    });
  }

  onSelect(poke: any): void {
  }

  async getPokemonList(limit: number, offset: number) {
    return await this.pokemonService.getPokemonList(limit, offset);
  }

  async getPokemonNamesList() {
    return await this.pokemonService.getPokemonNamesList();
  }

  async getPokemonByName(name: string) {
    return await this.pokemonService.getPokemonByName(name);
  }

  lastPage() {
    this.page--;
    let offset = this.perPage*this.page;
    this.getPokemonList(this.perPage, offset).then(result => {
      this.pokemons = result.data;
      this.next = result.next;
    });
  }

  nextPage() {
    this.page++;
    let offset = this.perPage*this.page;
    this.getPokemonList(this.perPage, offset).then(result => {
      this.pokemons = result.data;
      this.next = result.next;
      console.log(this.next);
    });
  }

}
