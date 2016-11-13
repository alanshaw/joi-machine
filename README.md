# Joi Machine [![Build Status](https://img.shields.io/travis/alanshaw/joi-machine.svg?style=flat)](https://travis-ci.org/alanshaw/joi-machine) [![Dependency Status](https://david-dm.org/alanshaw/joi-machine.svg?style=flat)](https://david-dm.org/alanshaw/joi-machine)

Generate a [Joi](https://github.com/hapijs/joi) schema from some JSON or a JS object.

Useful for creating a base to build your schema from when you have a big payload to validate.

## Example

```sh
npm install -g joi-machine
echo '{"foo": {}, "bar": 45, "baz": ["foob"]}' | joi-machine
Joi.object().keys({foo: Joi.object(), bar: Joi.number().integer(), baz: Joi.array().items(Joi.string())})
```

**or**

```js
var fs = require('fs')
var concat = require('concat-stream')
var joiMachine = require('joi-machine')

// data.json: {"foo": {}, "bar": 45, "baz": ["foob"]}
fs.createReadStream(__dirname + '/data.json')
  .pipe(joiMachine())
  .pipe(concat({encoding: 'string'}, console.log))

// Output: Joi.object().keys({foo: Joi.object(), bar: Joi.number().integer(), baz: Joi.array().items(Joi.string())})
```

**or**

```js
var fs = require('fs')
var concat = require('concat-stream')
var joiMachine = require('joi-machine')

var generator = joiMachine.obj()

generator.pipe(concat({encoding: 'string'}, console.log))

// data.json: {"foo": {}, "bar": 45, "baz": ["foob"]}
generator.write(require('./data.json'))
generator.end()

// Output: Joi.object().keys({foo: Joi.object(), bar: Joi.number().integer(), baz: Joi.array().items(Joi.string())})
```
