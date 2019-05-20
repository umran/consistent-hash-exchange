const crypto = require('crypto')
const EventEmitter = require('events')

const hexMappings = {
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  x0: 0,
  x1: 1,
  x2: 2,
  x3: 3,
  x4: 4,
  x5: 5,
  x6: 6,
  x7: 7,
  x8: 8,
  x9: 9
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

class Exchange extends EventEmitter {
  constructor(task, concurrency) {
    super()

    this._size = size
    this._queues = []

    this._task = task

    for (let i=0; i<size; i++) {
      this._queues.push(Promise.resolve())
    }
  }

  enqueue(replyToken, routingKey, args) {
    const keyHash = crypto.createHash('sha256')
      .update(routingKey)
      .digest('hex')

    const condensedKey = condenseHash(keyHash)
    const queueIndex = condensedKey % this._size

    this._queues[queueIndex] = this._queues[queueIndex].then(() => this._task(args)).then(results => {
      this.emit(replyToken, { results })

      return Promise.resolve()
    }, error => {
      this.emit(replyToken, { error })

      return Promise.resolve()
    })
  }
}

module.exports = Exchange