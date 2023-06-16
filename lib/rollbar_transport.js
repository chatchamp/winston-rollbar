
/**
 * Rollbar Transport
 *
 * A rollbar transport for winston 3
 * based on previous versions/forks:
 * - https://github.com/golyakov/winston-rollbar
 * - https://github.com/GorillaStack/winston-rollbar
 * - https://github.com/Ideame/winston-rollbar
 */

const util = require('util');
const TransportStream = require('winston-transport');
const rollbar = require('rollbar');

class RollbarTransport extends TransportStream {
  constructor(opts) {
    super(opts);
    if (!opts.rollbarConfig?.accessToken) {
      throw "winston-transport-rollbar requires a 'rollbarConfig.accessToken' property";
    }

    const _rollbar = new rollbar(opts.rollbarConfig);

    this.name = 'rollbarnew';
    this.level = opts.level || 'warn';
    this.rollbar = _rollbar;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const level = info[Symbol.for('level')];
    const message = info.message;
    const meta = Object.assign({}, info);
    delete meta.level;
    delete meta.message;
    delete meta.splat;
    delete meta[Symbol.for('level')];

    if (level === 'error') {
      this.rollbar.error(message, meta, callback);
    } else if (level === 'warn') {
      this.rollbar.warning(message, meta, callback);
    } else if (level === 'info') {
      this.rollbar.info(message, meta, callback);
    } else if (level === 'debug') {
      this.rollbar.debug(message, meta, callback);
    }
  }
}

module.exports = RollbarTransport;
