const cote = require('cote')
const { getIPAddress, restartBalenaService } = require('./src/utils')

const labsPublisher = new cote.Publisher({ name: 'Fleet publisher' })
const labsSubscriber = new cote.Subscriber({ name: 'Fleet subscriber' })

labsPublisher.publish('fleet-update', {service: "url", value: getIPAddress() })

// Handle fleet-update events
// Whenever the master server changes, reset snapcast-client service
labsSubscriber.on('fleet-update', (update) => {
  if (masterServer.hasChanged(update.master)) {
    console.log(`Multi-room master has changed to ${update.master}, restarting snapcast-client`)
    restartBalenaService('snapcast-client')
  }
  masterServer.update(update.master)
})

// Handle fleet-sync events
// Whenever a device joins the network, ask for current master
labsSubscriber.on('fleet-sync', () => {
  if (masterServer.isCurrentMaster) {
    console.log(`New multi-room device joined, syncing fleet...`)
    labsPublisher.publish('fleet-update', { master: getIPAddress() })
  }
})

// Allow cote to establish connections before sending fleet-sync
setTimeout(() => {
  labsPublisher.publish('fleet-sync')
}, 3000)

// Simple http server to share server address
// On restart, snapcast-client service will grab the new master server ip address from here
// TODO: Find a better way of doing this?
masterServer.listen()
