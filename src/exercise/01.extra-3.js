import * as React from 'react'
import {
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
  PokemonInfoFallback,
} from '../pokemon'
import {createResource} from '../utils'

const resource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
  const pokemon = resource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <React.Suspense fallback={<PokemonInfoFallback />}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App