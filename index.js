'use strict';

const logger = console;

class QueueConsumer {
    constructor(config) {
        this.queue = config.queue;
        this.logger = config.logger || logger.log;
        this.errorLogger = config.errorLogger || logger.error;
    }

    consume(callback) {
        this.logger(`Consuming messages from ${this.queue.queueUrl}`);
        const processMessage = (message) => {
            return Promise.resolve()
                .then(() => {
                    return callback(message.Body, message.Attributes)
                        .then(() => message);
                })
                .then(() => this.queue.deleteMessage(message))
                .catch(err => {
                    this.errorLogger(`Error processing message ${message.MessageId}`, err);
                });
        };
        this.queue.getNextNonEmptyBatch()
            .then(messages =>
                Promise.all(messages.map(m => processMessage(m, callback))))
            .then(() => this.consume(callback))
            .catch(err => {
                this.errorLogger(`Error processing messages`, err);
            });
    }
}

module.exports = QueueConsumer;
