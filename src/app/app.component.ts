import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { PokemonRes } from './models/pokemonRes';
import { MatDialog } from '@angular/material/dialog';
import { PokeDetailComponent } from './components/poke-detail/poke-detail.component';

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
  colMat: number;
  load: boolean = true;

  constructor(private pokemonService: PokemonService, public dialog: MatDialog) {}

  ngOnInit() {
    this.colMat = (window.innerWidth <= 500) ? 1 : 3;
    this.getPokemonNamesList().then(result => {
      this.namesList = result;
      this.filteredList = result;
      this.updatePage();
    });
  }

  onResize(event) {
    this.colMat = (event.target.innerWidth <= 500) ? 1 : 3;
  }

  updatePage(): void {
    this.load = true;
    if(this.filteredList.length > this.perPage) {
      this.pagList = this.filteredList.slice(this.perPage*this.page, this.perPage*this.page+this.perPage);
    } else {
      this.pagList = this.filteredList;
    }
    if(this.pagList[this.pagList.length-1]["name"] === this.filteredList[this.filteredList.length-1]["name"]) {
      this.next = false;
    } else {
      this.next = true;
    }
    this.pokemonService.getPokemonListByName(this.pagList).then(result => {
      this.pokemons = result.data;
      this.load = false;
    });
  }

  filterPokemon(number: boolean): void {
    this.filteredList = number ? 
    this.namesList.filter((elem, index) => {
      return (index+1).toString().includes(parseInt(this.filter).toString())
    }) : 
    this.namesList.filter(elem => elem["name"].includes(this.filter));
    if(this.filteredList.length > 0) {
      this.updatePage();
    } else {
      this.pokemons = [];
    }
  }

  onSubmitted(searchString: string): void {
    this.filter = searchString;
    this.page = 0;
    if(searchString) {
      let number = parseInt(searchString) ? true: false;
      this.filterPokemon(number);
    } else {
      this.filteredList = this.namesList;
      this.updatePage();
    }
  }

  onSelect(poke: any): void {
    const dialogRef = this.dialog.open(PokeDetailComponent, {
      data: poke,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async getPokemonNamesList(): Promise<any> {
    return await this.pokemonService.getPokemonNamesList();
  }

  async getPokemonByName(name: string): Promise<any> {
    return await this.pokemonService.getPokemonByName(name);
  }

  lastPage(): void {
    this.page--;
    this.updatePage();
    this.pokemonService.getPokemonListByName(this.pagList).then(result => {
      this.pokemons = result.data;
    });
  }

  nextPage(): void {
    this.page++;
    this.updatePage();
    this.pokemonService.getPokemonListByName(this.pagList).then(result => {
      this.pokemons = result.data;
    });
  }

}
