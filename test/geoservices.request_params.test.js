var geoservices = require('../');
var assert = require('assert');

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
