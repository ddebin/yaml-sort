#!/usr/bin/env node

'use strict'

const test = require('tape')
const spawn = require('tape-spawn')
const opts = { cwd: __dirname }

test('CLI --help', (t) => {
  const proc = spawn(t, '../yaml-sort.js -h', opts)
  proc.stdout.match(/^Usage:/)
  proc.stderr.match('')
  proc.exitCode(0)
  proc.end()
})

test('CLI w/o arg', (t) => {
  const proc = spawn(t, '../yaml-sort.js', opts)
  proc.stdout.match('')
  proc.exitCode(1)
  proc.end()
})

test('CLI w/o arg (STDIN)', (t) => {
  const proc = spawn(t, 'cat test.yml | ../yaml-sort.js', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI w/ arg', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI quoting style single', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test-edges.yml --stdout --quotingStyle single', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    a: \'hello: "john"\'\n' +
      '    d: false\n' +
      '    e: \'"foo"\'\n' +
      '    f: \'\'\'foo\'\'\'\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI quoting style double', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test-edges.yml --stdout --quotingStyle double', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    a: "hello: \\"john\\""\n' +
      '    d: false\n' +
      '    e: "\\"foo\\""\n' +
      '    f: "\'foo\'"\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --output', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test.yml --output output.yml' +
        ' && cat output.yml' +
        ' && rm -f output.yml', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --output -', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test.yml --output -', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    d: false\n')
  proc.stderr.match('')
  proc.end()
})
test('CLI --output (STDIN)', (t) => {
  const proc = spawn(t,
    'cat test.yml | ../yaml-sort.js --input - --output output.yml' +
      ' && cat output.yml' +
      ' && rm -f output.yml', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI (STDIN) (STDOUT)', (t) => {
  const proc = spawn(t, 'cat test.yml | ../yaml-sort.js', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --indent', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout --indent 4', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n' +
        'b:\n' +
        '    b: 35\n' +
        '    c:\n' +
        '        d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --lineWidth', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout --lineWidth 40', opts)
  proc.exitCode(0)
  proc.stdout.match('a: >-\n' +
        '  Lorem ipsum dolor sit amet, consectetur\n' +
        '  adipiscing elit...\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --lineWidth unlimited', (t) => {
  const proc = spawn(t, '../yaml-sort.js --input test-long-line.yml --stdout --lineWidth -1', opts)
  proc.exitCode(0)
  proc.stdout.match('a: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec volutpat mi, ac consectetur est. Proin venenatis tortor ut erat interdum finibus.\n' +
      'b:\n' +
      '  b: 35\n' +
      '  c:\n' +
      '    d: false\n')
  proc.stderr.match('')
  proc.end()
})

test('CLI --check FAIL', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test.yml --check', opts)
  proc.exitCode(1)
  proc.stdout.match('')
  proc.stderr.match('\'test.yml\' is not sorted and/or formatted (indent, line width).\n')
  proc.end()
})

test('CLI --check SUCCESS', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input sorted.yml --check', opts)
  proc.exitCode(0)
  proc.stdout.match('')
  proc.stderr.match('')
  proc.end()
})

test('CLI --encoding FAIL', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test-utf16le.yml --stdout', opts)
  proc.exitCode(1)
  proc.stdout.match('')
  proc.stderr.match(/null byte is not allowed in input/)
  proc.end()
})

test('CLI --encoding SUCCESS', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test-utf16le.yml --stdout --encoding utf16le', opts)
  proc.exitCode(0)
  proc.stderr.match('')
  proc.end()
})

test('CLI --lineWidth SUCCESS', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test.yml --output output.yml' +
        ' && ../yaml-sort.js --input output.yml --check' +
        ' && rm -f output.yml', opts)
  proc.exitCode(0)
  proc.stdout.match('')
  proc.stderr.match('')
  proc.end()
})

test('CLI --output --stdout FAIL', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test.yml --stdout --output output.yml', opts)
  proc.exitCode(1)
  proc.stdout.match('')
  proc.stderr.match(/Arguments stdout and output are mutually exclusive/)
  proc.end()
})

test('CLI --check --stdout FAIL', (t) => {
  const proc = spawn(t,
    '../yaml-sort.js --input test.yml --check --stdout', opts)
  proc.exitCode(1)
  proc.stdout.match('')
  proc.stderr.match(/Arguments check and stdout are mutually exclusive/)
  proc.end()
})
