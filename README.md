# Node Consistent Hash Exchange

An internal message exchange that distributes asynchronous requests into serializable, but concurrently running queues using consistent hashing as the routing mechanism.

## Guarantees

Since the exchange uses consistent hashing, every job enqueued with the same routingKey ends up in the same queue. That way, partial ordering of requests based on their routing key can be achieved while maintaing a desired level of concurrency.

## Usage

```javascript
const Exchange = require('consistent-hash-exchange')

// define a task
const task = async args => {
  // do something async and return results
  const result = await db.write(args)

  return result
}

// create a new exchange that binds 20 concurrent queues each
// running the task defined above in series
const exchange = new Exchange(task, 20)

// enqueue a job
const replyToken = Math.floor(Math.random() * 10)
const routingKey = 'some routing key'
const args = { name: 'some name' }
exchange.enqueue(replyToken, routingKey, args)

// listen to the reply event that will be fired when
// the job has been processed
exchange.once(replyToken, result => {
  console.log(result)
})
```