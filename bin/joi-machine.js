#!/usr/bin/env node
var machine = require('../')
var generator = machine()

process.stdin.pipe(generator).pipe(process.stdout)

// Formatting...
generator.once('finish', function () {
  console.log()
})
