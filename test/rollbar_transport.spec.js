const RollbarTransport = require('../lib/rollbar_transport');
const rollbar = require('rollbar');

jest.mock('rollbar');

describe('RollbarTransport', () => {
  let transport;
  let rollbarMock;

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

  it('throws an error if no accessToken is provided', () => {
    expect(() => new RollbarTransport({})).toThrow(
      "winston-transport-rollbar requires a 'rollbarConfig.accessToken' property"
    );
  });

  it('logs messages with log level error', async () => {
    const logData = { level: 'error', message: 'test' };
    transport.log(logData);

    // wait for process.nextTick
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(rollbarMock.error).toHaveBeenCalledWith(logData.message, logData, new Error(logData.stack), expect.any(Function));
  });


});
