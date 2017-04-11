# Queue consumer loop

The consumer of the messages coming from a queue-like source. 

## Usage

To consume messages you provide a callback to `consume` function. Example:

```
const queueConsumerLoop = require('queue-consumer')({
    queue: <the_queue>
});
const callback = function(messageBody, messageAttributes, messageId) {
    // handle message
};
queueConsumerLoop(callback);
```

this will run inifnite loop of callback invocations for each message. The messages will be automatically deleted as long as callback didn't throw an exception.

## The queue interface
The queue is assumed to be an object with following functions:
  * `getNextNonEmptyBatch()` - returns next batch of messags to be processed
  * `deleteMessage(message)` - deletes given message (marks as processed)

