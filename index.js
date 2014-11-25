var request = require('request')
  , util  = require('util')
  , qs    = require('querystring');

require('request-debug')(request);

module.exports = function(site, username, password)
{
  this.site = site;
  this.username = username;
  this.password = password;

  this.getOptions = function(method, resource, filters, body){
    filters = filters || {};
    var options = {
      method: method,
      uri: util.format('https://%s.enchant.com/api/v1/%s',this.site,resource),
      qs: filters,
      auth: {
        user: this.username,
        pass: this.password
      },
      headers: {accept: '*/*'}
    };
    if(body){
      //options.body = body;
      options.json = body;
    }
    console.log(options);
    return options;
  }

  this.request = function(method, resource, filters, data, callback)
  {
    request(this.getOptions(method, resource, filters, data), function(err, res, body){
      if(!err && res.statusCode <= 204){
        console.log(res.statusCode);
        console.log(body);
        callback(null, body);
      }else{
        callback(err, null);
      }

    });

  }

  this.list = function(resource, filters, callback)
  {
    this.request('GET', resource, filters, null, callback);
  }

  this.create = function(resource, body, callback)
  {
    this.request('POST',resource, null, body, callback);
  }

  this.delete = function(resource, callback)
  {
    this.request('POST',resource, null, null, callback);
  }

  return this;
}