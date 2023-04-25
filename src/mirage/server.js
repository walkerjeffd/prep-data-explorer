import { createServer, Model, Serializer } from 'miragejs'
import stations from './fixtures/stations'
import variables from './fixtures/variables'
import results from './fixtures/results'

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    serializers: {
      application: Serializer.extend({
        embed: true,
        root: false
      }),
    },

    models: {
      station: Model,
      variable: Model,
      result: Model,
    },

    fixtures: {
      stations,
      variables,
      results
    },

    seeds(server) {
      server.loadFixtures('stations')
      server.loadFixtures('variables')
      server.loadFixtures('results')
    },

    routes() {
      this.urlPrefix = import.meta.env.VITE_API_URL
      this.timing = 1000
      this.get('/stations')
      this.get('/results')
      this.get('/variables')
      this.passthrough('data/**')
      this.passthrough('http://data.prepestuaries.org:3001/**')
    },
  })

  return server
}
