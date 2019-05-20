const EventEmitter = require('events')
const { determineQueue } = require('./utils')

class Exchange extends EventEmitter {
  constructor(task, concurrency) {
    super()

    this._concurrency = concurrency
    this._queues = []

    this._task = task

    for (let i=0; i<concurrency; i++) {
      this._queues.push(Promise.resolve())
    }
  }

  enqueue(replyToken, routingKey, args) {
    const queueIndex = determineQueue(routingKey, this._concurrency)

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