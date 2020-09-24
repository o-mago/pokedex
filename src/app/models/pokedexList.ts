export interface PokedexList {
  count: number
  next: string
  previous: string
  results: Array<PokedexListResults>
}

export interface PokedexListResults {
  name: string
  url: string
}