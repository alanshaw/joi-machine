var through = require('through2')
var Joi = require('joi')
var unquotedValidator = require('unquoted-property-validator')

var machine = function () {
  var json = ''

  return through(function (chunk, enc, cb) {
    json += chunk
    cb()
  }, function (cb) {
    buildSchema(this, JSON.parse(json))
    cb()
  })
}

machine.obj = function () {
  return through.obj(function (chunk, enc, cb) {
    buildSchema(this, chunk)
    cb()
  })
}

module.exports = machine

function buildSchema (stream, val) {
  if (val == null) {
    stream.push('Joi.any()')
  } else if (!Joi.string().validate(val).error) {
    if (!Joi.string().email().validate(val).error) {
      stream.push('Joi.string().email()')
    } else if (!Joi.string().uri().validate(val).error) {
      stream.push('Joi.string().uri()')
    } else {
      stream.push('Joi.string()')
    }
  } else if (!Joi.binary().validate(val).error) {
    stream.push('Joi.binary()')
  } else if (!Joi.number().validate(val).error) {
    if (!Joi.number().integer().validate(val).error) {
      stream.push('Joi.number().integer()')
    } else {
      stream.push('Joi.number()')
    }
  } else if (!Joi.boolean().validate(val).error) {
    stream.push('Joi.boolean()')
  } else if (!Joi.func().validate(val).error) {
    stream.push('Joi.func()')
  } else if (!Joi.array().validate(val).error) {
    stream.push('Joi.array()')

    if (val.length) {
      stream.push('.items(')
      val.forEach(function (v, i) {
        buildSchema(stream, v)
        if (i < val.length - 1) {
          stream.push(', ')
        }
      })
      stream.push(')')
    }
  } else if (!Joi.object().validate(val).error) {
    stream.push('Joi.object()')

    var keys = Object.keys(val)

    if (keys.length) {
      stream.push('.keys({')
      keys.forEach(function (k, i) {
        stream.push(unquotedValidator(k).quotedValue + ': ')
        buildSchema(stream, val[k])
        if (i < keys.length - 1) {
          stream.push(', ')
        }
      })
      stream.push('})')
    }
  } else {
    // Shouldn't get here?
    stream.push('Joi.any()')
  }
}
