'use strict';

const defaultLogger = console;

module.exports = function({queue, logger = defaultLogger}) {
    let consumeLoop = function(callback) {
        logger.info(`Consuming messages from ${queue.queueUrl}`);

        const processMessage = (message) => {
            return Promise.resolve()
                .then(() => callback(message.Body, message.MessageAttributes, message.MessageId))
                .then(() => queue.deleteMessage(message))
                .catch((err) => {
                    logger.error(`Error processing message ${message.MessageId}`, err, err.stack);
                });
        };

        queue.getNextNonEmptyBatch() // eslint-disable-line promise/catch-or-return
            .then((messages) => Promise.all(messages.map(m => processMessage(m, callback))))
            .catch(err => {
                logger.error('Error processing messages', err, err.stack);
            })
            .finally(() => consumeLoop(callback));
    };
    return consumeLoop
}
;
