const RollbarTransport = require('../lib/rollbar_transport');
const rollbar = require('rollbar');

jest.mock('rollbar');

describe('RollbarTransport', () => {
  let transport;
  let rollbarMock;

  function wait() {
    // wait for process.nextTick
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    rollbarMock = {
      log: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
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
      const logData = { level: 'error', message: 'test' };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(new Error(logData.message), logData, expect.any(Function));
    });

    it('logs with log level warn', async () => {
      const logData = { level: 'warn', message: 'test' };
      transport.log(logData);

      await wait()

      expect(rollbarMock.warning).toHaveBeenCalledWith(new Error(logData.message), logData, expect.any(Function));
    })

    it('logs error object if message is of type Error', async () => {
      const logData = { level: 'error', message: new Error('test') };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(logData.message, logData, expect.any(Function));
    })

    it('logs error object if stack is of type Error', async () => {
      const logData = { level: 'error', stack: new Error('test') };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(logData.stack, logData, expect.any(Function));
    })

    it('logs error object if stack is a string', async () => {
      const logData = { level: 'error', stack: 'test' };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(new Error(logData.stack), logData, expect.any(Function));
    })

    it('logs error object if job.stacktrace is a string', async () => {
      const logData = { level: 'error', job: { stacktrace: 'test' } };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(new Error(logData.job.stacktrace), logData, expect.any(Function));
    })

    it('logs error object if only message is a string', async () => {
      const logData = { level: 'error', message: 'test' };
      transport.log(logData);

      await wait()

      expect(rollbarMock.error).toHaveBeenCalledWith(new Error(logData.message), logData, expect.any(Function));
    })
  });
});
