var _ = require('underscore');

function RequestParams(obj) {
  this.toString = function() {
    return _.chain(obj)
      .reduce(function(memo, val, key) {
        memo[key] = RequestParams.serializeValue(val);
        return memo;
      }, {})
      .reduce(function(memo, val, key) {
        return memo += '&' + key + '=' + val;
      }, '')
      .value()
      .substring(1);
  };
}
RequestParams.serializeValue = function(val) {
  if (_.isUndefined(val))
    return '';
  else if (_.isNull(val))
    return '';
  else if (_.isObject(val))
    return JSON.stringify(val);
  else
    return val.toString();
};

module.exports = RequestParams;
