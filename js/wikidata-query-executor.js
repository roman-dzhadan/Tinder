export class WikidataQueryExecutor {

  #hostname = 'https://query.wikidata.org/sparql'

  async query(offset, limit) {
    const endpoint = this.#buildEndpoint(offset, limit)
    const requestInit = this.#buildRequestInit()
    return fetch(endpoint, requestInit)
      .then(body => body.json())
  }

  #buildEndpoint(offset, limit) {
    return this.#hostname + '?query=' + encodeURIComponent(this.#buildQuery(offset, limit))
  }

  #buildQuery(offset, limit) {
    console.log(`Loading of another ${limit} entries is gonna be requested in a moment with ${offset} entries offset.`)
    return `
            #List of actors with pictures with year of birth and/or death
            #defaultView:ImageGrid
            SELECT ?human ?humanLabel ?yob ?yod ?picture
            WHERE
            {
              ?human wdt:P31 wd:Q5
              ; wdt:P106 wd:Q33999 .
              ?human wdt:P18 ?picture .
              OPTIONAL { ?human wdt:P569 ?dob . ?human wdt:P570 ?dod }.
              BIND(YEAR(?dob) as ?yob) . #if available: year
              BIND(YEAR(?dod) as ?yod) .
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            }
            OFFSET ${offset}
            LIMIT ${limit}
    `
  }

  #buildRequestInit() {
    return {
      headers: new Headers({
        'Accept': 'application/sparql-results+json'
      })
    }
  }
}