const { determineQueue } = require('../../src/utils')

const bucketSize = 20
let buckets = []

for (let i=0; i<bucketSize; i++) {
  buckets.push(0)
}

const expSize = 1000

for (let j=0; j<expSize; j++) {
  //const routingKey = j.toString()
  const routingKey = Math.floor(Math.random() * expSize * 1000).toString()

  const bucketIndex = determineQueue(routingKey, bucketSize)

  buckets[bucketIndex] += 1
}

for (let k=0; k<bucketSize; k++) {
  console.log(`${k}: ${buckets[k]}`)
}
