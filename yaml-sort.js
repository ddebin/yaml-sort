#!/usr/bin/env node

'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
const yargs = require('yargs')

const argv = yargs
  .usage('Usage: $0 [options]')
  .example([
    ['$0 --input config.yml',
      'Sorts alphabetically and overwrites the file config.yml'],
    ['$0 --input config.yml --lineWidth 100 --stdout',
      'Sorts the file config.yml and output result to STDOUT wrapped to 100 columns'],
    ['$0 --input config.yml --indent 4 --output sorted.yml',
      'Indents with 4 spaces and outputs result to file sorted.yml'],
    ['cat config.yml | $0',
      'Sorts alphabetically from STDIN']
  ])
  .option('input', {
    alias: 'i',
    describe: 'The YAML file(s) which needs to be sorted',
    default: '-',
    string: true,
    array: true
  })
  .option('output', {
    alias: 'o',
    describe: 'The YAML file to output sorted content to',
    string: true
  })
  .option('stdout', {
    alias: 's',
    describe: 'Output the proposed sort to STDOUT only',
    conflicts: 'output',
    boolean: true
  })
  .option('check', {
    alias: 'k',
    describe: 'Check if the given file(s) is already sorted',
    conflicts: ['output', 'stdout'],
    boolean: true
  })
  .option('indent', {
    alias: 'id',
    default: 2,
    describe: 'Indentation width to use (in spaces)',
    number: true
  })
  .option('encoding', {
    alias: 'e',
    default: 'utf8',
    describe: 'Input encoding',
    choices: ['ascii', 'utf8', 'utf16le']
  })
  .option('quotingStyle', {
    alias: 'q',
    default: 'single',
    describe: 'Strings will be quoted using this quoting style',
    choices: ['single', 'double']
  })
  .option('lineWidth', {
    alias: 'w',
    default: 80,
    describe: 'Wrap line width',
    number: true
  })
  .help('h')
  .alias('h', 'help')
  .version()
  .wrap(null)
  .argv

let success = true

argv.input.forEach((file) => {
  try {
    const isStdin = file === '-'

    if (isStdin && process.stdin.isTTY) {
      console.error('Missing filename or input ("yaml-sort --help" for help)')
      process.exit(22)
    }

    const content = fs.readFileSync(isStdin ? process.stdin.fd : file, argv.encoding)

    const sorted = yaml.dump(yaml.load(content), {
      sortKeys: true,
      indent: argv.indent,
      lineWidth: argv.lineWidth,
      quotingType: argv.quotingStyle === 'double' ? '"' : "'"
    })

    if (argv.check) {
      if (sorted !== content.toString()) {
        success = false
        console.warn(`'${file}' is not sorted and/or formatted (indent, line width).`)
      }
    } else if (argv.stdout || (isStdin && !argv.output)) {
      console.log(sorted)
    } else {
      fs.writeFile(
        argv.output ? argv.output : file,
        sorted,
        (error) => {
          if (error) {
            success = false
            console.error(error)
          }
        })
    }
  } catch (error) {
    success = false
    console.error(error)
  }
})

if (!success) {
  process.exit(1)
}
