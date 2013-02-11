var geoservices = require('../');
var assert = require('assert');
var nock = require('nock');

var expectRequest = function(requestedPath, expectedPath, response, method, filter) {
  var req = nock('http://example.com');
  if (filter) {
    req = req.filteringPath(/\?.+$/, '');
  }
  var m = req[method];
  m(expectedPath || '').reply(200, response);
  return req;
};

var expectGetRequest = function(requestedPath, expectedPath, response, filter) {
  if (filter === undefined) {
    filter = true;
  }
  return expectRequest(requestedPath, expectedPath, response, 'get', filter);
};

var expectPostRequest = function(requestedPath, expectedPath, response, filter) {
  if (filter === undefined) {
    filter = true;
  }
  return expectRequest(requestedPath, expectedPath, response, 'post', filter);
};

var getUrlTest = function(requestedPath, expectedPath, filter) {
  return function(done) {
    expectGetRequest(requestedPath, expectedPath, '{}', filter);
    geoservices.get({
      host: 'example.com',
      path: requestedPath
    }, function() {
      nock.cleanAll();
      done();
    });
  };
};

var postUrlTest = function(requestedPath, expectedPath, response, filter) {
  response = response || '{}';
  return function(done) {
    expectPostRequest(requestedPath, expectedPath, response, filter);
    geoservices.post({
      host: 'example.com',
      path: requestedPath
    }, function() {
      nock.cleanAll();
      done();
    });
  };
};

describe('geoservices', function() {
  describe('get', function() {
    it('should request the specified URL', getUrlTest('/ArcGIS/rest/services', '/ArcGIS/rest/services'));

    it('should use method GET', function() {
      getUrlTest('', '');
    });

    it('should throw an error if no host', function() {
      assert.throws(function() {
        geoservices.get();
      });
    });

    it('should allow null path', getUrlTest(null, ''));

    it('should allow undefined path', getUrlTest(void 0, ''));

    it('should add json format parameter', getUrlTest('', '?f=json', false));

    it('should overwrite format parameter if present', getUrlTest('?f=html', '?f=json', false));

    it('should add params to querystring', function(done) {
      expectGetRequest('', '?param1=value1&f=json', '{}', false);
      geoservices.get({
        host: 'example.com',
        params: {
          param1: 'value1'
        }
      }, function() {
        nock.cleanAll();
        done();
      });
    });

    it('should add objects params to querystring', function(done) {
      expectGetRequest('', '?param1={%22param2%22:%22value1%22}&f=json', '{}', false);
      geoservices.get({
        host: 'example.com',
        params: {
          param1: { param2: 'value1' }
        }
      }, function() {
        nock.cleanAll();
        done();
      });
    });

    it('should parse and return response', function(done) {
      expectGetRequest('', '', '{ "success": true }');
      geoservices.get({
        host: 'example.com'
      }, function(result) {
        assert.deepEqual(result, {
          success: true
        });
        nock.cleanAll();
        done();
      });
    });

    it('should allow no callback', function(done) {
      expectGetRequest('', '');
      geoservices.get({
        host: 'example.com'
      });
      nock.cleanAll();
      done();
    });

    it('should return an error object when response cannot be parsed', function(done) {
      expectGetRequest('', '', '<xml>this is not json</xml>');
      geoservices.get({
        host: 'example.com'
      }, function(result) {
        assert.deepEqual('Response body is not valid JSON', result.error);
        assert.deepEqual('<xml>this is not json</xml>', result.responseBody);
        nock.cleanAll();
        done();
      });
    });
  });

  describe('post', function() {
    it('should request the specified URL', postUrlTest('/ArcGIS/rest/services', '/ArcGIS/rest/services'));

    it('should use method POST', postUrlTest('', ''));

    it('should throw an error if no host', function() {
      assert.throws(function() {
        geoservices.post();
      });
    });

    it('should allow null path', postUrlTest(null, ''));

    it('should allow undefined path', postUrlTest(void 0, ''));

    it('should add appropriate Content-Type header', function(done) {
      nock('http://example.com').matchHeader('Content-Type', 'application/x-www-form-urlencoded').post('').reply(200, '');
      geoservices.post({
        host: 'example.com'
      }, function() {
        nock.cleanAll();
        done();
      });
    });

    it('should serialize params object to body, adding json format param', function(done) {
      nock('http://example.com').post('', 'param1=value1&param2=value2&f=json').reply(200, '');
      geoservices.post({
        host: 'example.com',
        params: {
          param1: 'value1',
          param2: 'value2'
        }
      }, function() {
        nock.cleanAll();
        done();
      });
    });

    it('should serialize params object array to body', function(done) {
      nock('http://example.com').post('', 'param1=[{"param2":"value2","param3":"value3"}]&f=json').reply(200, '');
      geoservices.post({
        host: 'example.com',
        params: {
          param1: [
            {
              param2: 'value2',
              param3: 'value3'
            }
          ]
        }
      }, function() {
        nock.cleanAll();
        done();
      });
    });

    it('should parse and return response', function(done) {
      expectPostRequest('', '', '{ "success": true }');
      geoservices.post({
        host: 'example.com'
      }, function(result) {
        assert.deepEqual(result, {
          success: true
        });
        nock.cleanAll();
        done();
      });
    });

    it('should allow no callback', function(done) {
      expectPostRequest('', '');
      geoservices.post({
        host: 'example.com'
      });
      nock.cleanAll();
      done();
    });

    it('should return an error object when response cannot be parsed', function(done) {
      expectPostRequest('', '', '<xml>this is not json</xml>');
      geoservices.post({
        host: 'example.com'
      }, function(result) {
        assert.deepEqual('Response body is not valid JSON', result.error);
        assert.deepEqual('<xml>this is not json</xml>', result.responseBody);
        nock.cleanAll();
        done();
      });
    });
  });

  describe('RequestParams', function() {
    describe('serializeValue', function() {
      var fut = geoservices.RequestParams.serializeValue;

      it('should support undefined', function() {
        assert.equal(
          fut(undefined),
          ''
        );
      });

      it('should support null', function() {
        assert.equal(
          fut(null),
          ''
        );
      });

      it('should support booleans', function() {
        assert.equal(
          fut(true),
          'true'
        );
        assert.equal(
          fut(false),
          'false'
        );
      });

      it('should support numbers', function() {
        assert.equal(
          fut(1),
          '1'
        );
        assert.equal(
          fut(-1),
          '-1'
        );
      });

      it('should support strings', function() {
        assert.equal(
          fut('string'),
          'string'
        );
      });

      it('should support objects', function() {
        assert.equal(
          fut({key1:'val1',key2:'val2'}),
          '{"key1":"val1","key2":"val2"}'
        );
      });

      it('should support arrays', function() {
        assert.equal(
          fut([1,'2']),
          '[1,"2"]'
        );
      });

      it('should support url encoded chars', function() {
        assert.equal(
          fut('{, '),
          '{, '
        );
      });
    });
  });

  describe('serializeObject', function() {
    var fut = geoservices.serializeObject;

    it('should use format key=val', function() {
      assert.equal(
        fut({
          key: 'val'
        }),
        'key=val'
      );
    });

    it('should support multiple keys', function() {
      assert.equal(
        fut({
          key1: 'val1',
          key2: 'val2',
          key3: 'val3'
        }),
        'key1=val1&key2=val2&key3=val3'
      );
    });

    it('should support deep objects', function() {
      assert.equal(
        fut({
          key1: {
            key2: 'val2'
          }
        }),
        'key1={"key2":"val2"}'
      );
    });
  });
});
