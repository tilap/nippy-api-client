import apiResponse from 'nippy-api-response';

module.exports = class Response extends apiResponse {
  constructor(rawJson) {
    super();
    this.requestError = null;
    if (rawJson) {
      this.setFromRawJson(rawJson);
    }
  }

  setFromRawJson(json) {
    if (json.hasOwnProperty('metas')) super.setMetas(json.metas);
    if (json.hasOwnProperty('source')) super.setSource(json.source);
    if (json.hasOwnProperty('result') && json.hasOwnProperty(json.result)) {
      switch (json.result) {
        case 'success':
          super.setSuccess(json.success);
          break;
        case 'error':
          this.error.code = json.error.code || null;
          this.error.message = json.error.message || null;
          if (json.error.hasOwnProperty('details')) {
            super.setErrorDetails(json.error.details);
          }
          break;
        default:
          throw new Error(`Unknown result type ${json.result}`);
      }
    }
  }

  // Request error -------------------------------------------------------------

  setRequestError(error) {
    this.requestError = error;
  }

  hasRequestError() {
    return this.getRequestError() !== null;
  }

  getRequestError() {
    return this.requestError;
  }
};
