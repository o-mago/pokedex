import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'poke-card',
  templateUrl: './poke-card.component.html',
  styleUrls: ['./poke-card.component.css']
})
export class PokeCardComponent implements OnInit {

  @Input('pokeImage') pokeImage: string
  @Input('pokeName') pokeName: string
  @Input('pokeNumber') pokeNumber: number
  @Input('pokeTypes') pokeTypes: Array<any>

  constructor() { }

  ngOnInit(): void {
  }

}
