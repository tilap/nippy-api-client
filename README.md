# nippy-api-client

Simple Api client to use with nippy-api-response. Works both in browser and server.

For server, it requires fetch. So set a global named fetch bound to something like [node_fetch](https://www.npmjs.com/package/node-fetch).

```global.fetch = require('node-fetch')```

### Usage

```
import { Client } from 'nippy-api-client';

const cli = new Client({ endpoint: 'http://...' });
cli
  .run({ path: '/lorem', args : {}, data : {}, method: 'GET' })
  .then((apiresponse) => ...);
```

You can access the available errors string with

```
import { errors } from 'nippy-api-client';
```

Or the response class
```
import { Response } from 'nippy-api-client';
```

#### Events

Basic event handling on cli via ```cli.on(event, callbeck)``` with event one of that string:

- requestError
- responseError
- processingStart
- processingStop
- processingIncrease
- processingDecrease

## Dev

- ```npm run build```: transpile src to dist
- ```npm run lint```: lint the code
- ```npm run clean```: clean the dist folder
