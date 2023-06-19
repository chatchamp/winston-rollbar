const RollbarTransport = require('../lib/rollbar_transport');
const rollbar = require('rollbar');

jest.mock('rollbar');

describe('RollbarTransport', () => {
  let transport;
  let rollbarMock;

  function createLogData(level, message, payload = {}) {
    const logData = { level, message, ...payload };
    logData[Symbol.for('level')] = level;
    return logData;
  }

  beforeEach(() => {
    rollbarMock = {
      log: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };

    rollbar.mockReturnValue(rollbarMock);

    transport = new RollbarTransport({
      rollbarConfig: { accessToken: 'test' },
    });
  });

  describe('#log', () => {
    it('throws an error if no accessToken is provided', () => {
      expect(() => new RollbarTransport({})).toThrow(
        "winston-transport-rollbar requires a 'rollbarConfig.accessToken' property"
      );
    });

    it('logs with log level error', async () => {
      const logData = createLogData('error', 'test');
      transport.log(logData, function() {});

      expect(rollbarMock.error).toHaveBeenCalledWith(logData.message, {}, expect.any(Function));
    });

    it('logs with log level warn', async () => {
      const logData = createLogData('warn', 'test');
      transport.log(logData, function() {});

      expect(rollbarMock.warning).toHaveBeenCalledWith(logData.message, {}, expect.any(Function));
    });

    it('logs with log level info', async () => {
      const logData = createLogData('info', 'test');
      transport.log(logData, function() {});

      expect(rollbarMock.info).toHaveBeenCalledWith(logData.message, {}, expect.any(Function));
    })

    it('logs with log level debug', async () => {
      const logData = createLogData('debug', 'test');
      transport.log(logData, function() {});

      expect(rollbarMock.debug).toHaveBeenCalledWith(logData.message, {}, expect.any(Function));
    })

    it('logs additional payload as meta', () => {
      const logData = createLogData('error', 'test', { foo: 'bar' });
      transport.log(logData, function() {});

      expect(rollbarMock.error).toHaveBeenCalledWith(logData.message, { foo: 'bar' }, expect.any(Function));
    })

    it('logs with log level info by default', async () => {
      const logData = createLogData('unknown', 'test');
      transport.log(logData, function() {});

      expect(rollbarMock.info).toHaveBeenCalledWith(logData.message, {}, expect.any(Function));
    })
  });
});
