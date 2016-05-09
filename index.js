'use strict';

const logger = console;

class QueueConsumer {
    constructor(config) {
        this.queue = config.queue;
        this.logger = config.logger || logger;
    }

    consume(callback) {
        this.logger.info(`Consuming messages from ${this.queue.queueUrl}`);

        const processMessage = (message) => {
            return Promise.resolve()
                .then(() => callback(message.Body, message.MessageAttributes))
                .then(() => this.queue.deleteMessage(message))
                .catch((err) => {
                    this.logger.error(`Error processing message ${message.MessageId}`, err, err.stack);
                });
        };

        this.queue.getNextNonEmptyBatch()
            .then((messages) => Promise.all(messages.map(m => processMessage(m, callback))))
            .catch(err => {
                this.logger.error(`Error processing messages`, err, err.stack);
            })
            .finally(() => this.consume(callback));
    }
}

module.exports = QueueConsumer;
