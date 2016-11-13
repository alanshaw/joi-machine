var test = require('tape')
var concat = require('concat-stream')
var Joi = require('joi')
var vm = require('vm')
var machine = require('./')

/**
 * 1. Create schema for the passed data
 * 2. Validate the returned schema against the data
 * 3. Return the schema for further testing
 */
function testSchema (data, cb) {
  var generator = machine.obj()

  generator.pipe(concat(function (schemaStr) {
    console.log(schemaStr)
    try {
      var schema = vm.runInNewContext(schemaStr, {Joi: Joi})
      schema.validate(data, function (er) {
        if (er) return cb(er)
        cb(null, schema)
      })
    } catch (er) {
      cb(er)
    }
  }))

  generator.write(data)
  generator.end()
}

test('Create schema for object', function (t) {
  t.plan(1)

  var data = {}

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for string', function (t) {
  t.plan(1)

  var data = 'OH HAI!'

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for email', function (t) {
  t.plan(1)

  var data = 'test@example.org'

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for uri', function (t) {
  t.plan(1)

  var data = 'http://example.org'

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for number', function (t) {
  t.plan(2)

  var data = 1.138

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')

    schema.validate(138, function (er) {
      t.ifError(er, 'Should also validate against an integer')
      t.end()
    })
  })
})

test('Create schema for integer', function (t) {
  t.plan(2)

  var data = 138

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')

    schema.validate(1.138, function (er) {
      t.ok(er, 'Should not validate against an float')
      t.end()
    })
  })
})

test('Create schema for boolean', function (t) {
  t.plan(1)

  var data = true

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for binary', function (t) {
  t.plan(1)

  var data = new Buffer('BLAH')

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for function', function (t) {
  t.plan(1)

  var data = function () {}

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for undefined', function (t) {
  t.plan(1)

  var data

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for empty array', function (t) {
  t.plan(1)

  var data = []

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for array of all sorts', function (t) {
  t.plan(1)

  var data = [2, 'foo', {}, {foo: false}, [], [1], function () {}]

  testSchema(data, function (er, schema) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for object of all sorts', function (t) {
  t.plan(1)

  var data = {
    foo: {},
    bar: {foo: true},
    baz: [45.6, 34.67, 10.5],
    boz: 'foobar',
    bozo: 34
  }

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})

test('Create schema for object with keys that require quotes', function (t) {
  t.plan(1)

  var data = {
    '-xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    '-xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
  }

  testSchema(data, function (er) {
    t.ifError(er, 'Validating schema against data')
    t.end()
  })
})
