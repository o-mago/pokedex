export interface Pokemon {
  abilities: Array<object>,
  base_experience: number,
  forms: Array<object>,
  game_indices: Array<object>,
  height: number,
  held_items: Array<object>,
  id: number,
  is_default: true,
  location_area_encounters: string,
  moves: Array<object>,
  name: string,
  order: number,
  species: object,
  sprites: object,
  stats: Array<Stats>,
  types: Array<object>,
  weight: number
}

interface Stats {
  base_stat: number
  effort: number
  stat: {
    name: string, 
    url: string
  }
}
