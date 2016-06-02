import Response from './response';
import errors from './errors';

module.exports = class ApiClient {
  constructor({ endpoint = '', token = null } = {}) {
    this.endpoint = endpoint;
    this.token = token;
    this.onEvents = {
      requestError: [],
      responseError: [],
      processingStart: [],
      processingStop: [],
      processingIncrease: [],
      processingDecrease: [],
    };
    this.processing = 0;
  }

  isProcessing() {
    return this.processing > 0;
  }

  increaseProcessing() {
    if (this.processing === 0) {
      this.emit('processingStart');
    }
    this.processing ++;
    this.emit('processingIncrease', this.processing);
  }

  decreseProcessing() {
    this.processing --;
    this.emit('processingDecrease', this.processing);
    if (this.processing === 0) {
      this.emit('processingStop');
    }
  }

  setToken(token) {
    if (token) {
      this.token = token;
    } else {
      this.resetToken();
    }
    return this;
  }

  hasToken() {
    return this.getToken() !== null;
  }

  getToken() {
    return this.token;
  }

  resetToken() {
    this.token = null;
    return this;
  }

  removeToken() {
    this.token = null;
    return this;
  }

  on(event, cb) {
    if (!this.onEvents.hasOwnProperty(event)) throw new Error(`Unknown event ${event}`);
    this.onEvents[event].push(cb);
  }

  emit(event, value = null) {
    if (this.onEvents.hasOwnProperty(event)) {
      this.onEvents[event].forEach((cb) => cb(value));
    }
  }

  get(path = '', args = {}) {
    return this.run({ path, args, method: 'GET' });
  }

  post(path = '', args = {}, data = {}) {
    return this.run({ path, args, data, method: 'POST' });
  }

  patch(path = '', args = {}, data = {}) {
    return this.run({ path, args, data, method: 'PATCH' });
  }

  delete(path = '', args = {}) {
    return this.run({ path, args, method: 'DELETE' });
  }

  buildFullUrl(path, args = {}) {
    let url = `${this.endpoint}${path}`;

    let query = '';
    if (this.hasToken()) {
      args.access_token = this.getToken();
    }
    if (args && Object.keys(args).length > 0) {
      Object.keys(args).forEach((key) => query += `${key}=${args[key]}&`);
    }

    if (query !== '') {
      url += `?${query}`;
    }
    return url;
  }

  buildOptions({ method = 'GET', data = {} } = {}) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.hasToken()) {
      headers['jwt-token'] = this.getToken();
    }

    let options = { mode: 'cors', cache: 'default', method, headers };
    if (Object.keys(data).length > 0) {
      options.body = JSON.stringify(data);
    }

    return options;
  }

  async run({ path = '', args = {}, data = {}, method = 'GET' } = {}) {
    const url = this.buildFullUrl(path, args);
    const options = this.buildOptions({ method, data });
    const response = new Response();

    let fetchResponse = null;
    let rawRes = null;

    this.increaseProcessing();

    try {
      fetchResponse = await fetch(url, options);
      if (!fetchResponse.ok) {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.log('fetch connexion error', err);
      response.setRequestError(new Error(errors.CONNECT));
    }

    if (!response.hasRequestError()) {
      try {
        rawRes = await fetchResponse.json();
      } catch(err) {
        console.log('fetch toJson error', err);
        response.setRequestError(new Error(errors.FORMAT));
      }
    }

    if (!response.hasRequestError() && rawRes) {
      try {
        response.setFromRawJson(rawRes);
      } catch(err) {
        console.log('fetch setFromRawJson error', err);
        response.setRequestError(new Error(errors.FORMAT));
      }
    }

    if (response.hasRequestError()) {
      this.emit('requestError', response.getRequestError());
      this.decreseProcessing();
      throw response;
    }

    if (response.isError()) {
      this.emit('responseError', response.getError());
      this.decreseProcessing();
      throw response;
    }

    this.decreseProcessing();
    return response;
  }
};
