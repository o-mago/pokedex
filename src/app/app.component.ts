import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { Pokemon } from './models/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  pokemon = {} as Pokemon;
  pokemons: Pokemon[];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.getPokemon(12, 0);
  }

  getPokemon(limit: number, offset: number) {
    this.pokemonService.getPokemonList(limit, offset).then(result => {
      this.pokemons = result;
      console.log(this.pokemons);
    });
  }

}
