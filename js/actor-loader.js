import { WikidataQueryExecutor } from './wikidata-query-executor.js'

export class ActorLoader {

  #spinner = document.querySelector('#spinner')
  #portrait = document.querySelector('#portrait')
  #queryExecutor = new WikidataQueryExecutor()
  #queueOfActors = new Array()
  #numberOfLoadedBatches = 0
  #loadingBatchSize
  #loadingIntervalInMillis
  #loadingIntervalRef

  constructor(loadingBatchSize = 10, loadingIntervalInMillis = 5000, autoLoading = false) {
    this.#loadingBatchSize = loadingBatchSize
    this.#loadingIntervalInMillis = loadingIntervalInMillis
    if (autoLoading) {
      this.startLoading()
    }
  }

  dislike() {
    this.#portrait.setAttribute('src', this.#queueOfActors.shift().picture.value)
  }

  like() {
    this.#portrait.setAttribute('src', this.#queueOfActors.shift().picture.value)
  }

  startLoading() {
    if (this.#loadingIntervalRef) {
      throw new Error(`Interval loading of actors cannot be requested to start.`)
    } else {
      console.log(`Interval loading of actors has been requested to start with ${this.#loadingIntervalInMillis}ms.`)
      this.#loadingIntervalRef = setInterval(() => {
        this.#loadMore()
      }, this.#loadingIntervalInMillis)
    }
  }

  stopLoading() {
    if (this.#loadingIntervalRef) {
      console.log('Interval loading of actors has been requested to stop.')
      clearInterval(this.#loadingIntervalRef)
    } else {
      throw new Error('Cannot stop loading of new actors. The is not running at the moment.')
    }
  }

  #loadMore() {
    this.#queryExecutor.query(this.#numberOfLoadedBatches * this.#loadingBatchSize, this.#loadingBatchSize)
      .then(response => {
        const numberOfQueuedActors = this.#queueOfActors.length
        const loadedBatchOfActors = response.results.bindings
        this.#queueOfActors.push(...response.results.bindings)
        if (numberOfQueuedActors === 0 && loadedBatchOfActors.length > 0) {
          this.#spinner.setAttribute('hidden', true)
          this.#portrait.setAttribute('src', this.#queueOfActors[0].picture.value)
          this.#portrait.removeAttribute('hidden')
        }
        console.log(`Current queue contains ${this.#queueOfActors.length} actors.`)
      })
    this.#numberOfLoadedBatches += 1 // has to be outside of the promise chain
  }
}