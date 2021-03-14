import * as React from 'react'
import {PokemonDataView, fetchPokemon, PokemonErrorBoundary} from '../pokemon'

function createResource(callback) {
  let status = 'pending'
  let result = callback.then(
    resolved => {
      status = 'success'
      result = resolved
    },
    rejected => {
      status = 'error'
      result = rejected
    },
  )

  return {
    read: () => {
      if (status === 'pending') throw result
      if (status === 'error') throw result
      if (status === 'success') return result
      throw new Error('Oops i guess the impossible happens')
    },
  }
}

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
          <React.Suspense fallback={<div>Loading Pokemon...</div>}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
