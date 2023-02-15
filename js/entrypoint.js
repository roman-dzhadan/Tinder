import { ActorLoader } from './actor-loader.js'

// screen.orientation.onchange = () => alert(screen.orientation.type)
// screen.orientation.lock('portrait-primary').then(() => alert('locked')).catch((e) => alert('not locked - ' + e))


const loader = new ActorLoader(9, 7 * 1000, false) // create the actor loader with 7 seconds interval in auto start mode and 9 actors per batch
setTimeout(() => {
    loader.stopLoading()
}, 60 * 1000)

document.querySelector('.btn-left').addEventListener('click', () => loader.dislike())
document.querySelector('.btn-right').addEventListener('click', () => loader.like())
