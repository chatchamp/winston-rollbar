# winston-transport-rollbar-3

Forked from previous versions, simplified, and updated to support winston@3.

A [rollbar](https://rollbar.com) transport for [winston](https://github.com/winstonjs/winston).

## Installation

``` sh
  $ yarn add winston
  $ yarn add winston-transport-rollbar-3
```

## usage

``` js
const {createLogger} = require('winston');
const RollbarTransport = require('winston-transport-rollbar-3');

const rollbarConfig = {};

const logger = createLogger({
  transports: [
    new RollbarTransport({
      rollbarConfig,
      level
    })
  ]
});
```

## Options

The Rollbar transport uses the universal [rollbar.js](https://github.com/rollbar/rollbar.js) library behind the scenes.  Options are the following:

* **rollbarConfig**:        Rollbar configuration ([more info](https://rollbar.com/docs/notifier/node_rollbar/#configuration-reference)) (mandatory, must contain rollbarAccessToken)
* **level**:                Level of messages this transport should log. (default: **warn**).

## Contribute

### Test
```bash
yarn test
```
