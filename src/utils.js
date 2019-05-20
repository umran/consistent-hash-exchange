const crypto = require('crypto')
const hexMappings = require('./hexMappings')

const createHash = routingKey => {
  return crypto.createHash('sha256')
      .update(routingKey)
      .digest('hex')
}

const condenseHash = hash => {
  let sum = 0
  
  for (let i=0; i<hash.length; i++) {
    if (hexMappings[`${hash[i]}`]) {
      sum += hexMappings[`${hash[i]}`]
    } else {
      sum += hexMappings[`x${hash[i]}`]
    }
  }

  return sum
}

const determineQueue = (routingKey, concurrency) => {
  const keyHash = createHash(routingKey)
  const condensedKey = condenseHash(keyHash)
  const queue = condensedKey % concurrency

  return queue
}

module.exports = {
  determineQueue
}