// Cache resources
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

let pokemonResourceCache = {}
const PokemonCacheContext = React.createContext(getPokemonResource)

function getPokemonResource(pokemonName) {
  let resource = pokemonResourceCache[pokemonName]

  if (!resource) {
    resource = createPokemonResource(pokemonName)
    pokemonResourceCache[pokemonName] = resource
  }

  return resource
}

function usePokemonResouceCache() {
  return React.useContext(PokemonCacheContext)
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const getPokemonResourceV2 = usePokemonResouceCache()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResourceV2(pokemonName))
    })
  }, [pokemonName, startTransition, getPokemonResourceV2])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
