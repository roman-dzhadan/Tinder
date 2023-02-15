import { ActorLoader } from './actor-loader.js'

const loader = new ActorLoader(9, 7 * 1000, true) // create the actor loader with 7 seconds interval in auto start mode and 9 actors per batch
setTimeout(() => {
    loader.stopLoading()
}, 60 * 1000)

document.querySelector('.control-dislike').addEventListener('click', () => loader.dislike())
document.querySelector('.control-like').addEventListener('click', () => loader.like())
