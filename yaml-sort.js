#!/usr/bin/env node

'use strict';

const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .example(
        '$0 --input config.yml',
        'Sorts alphabetically and overwrites the file config.yml.',
    )
    .example(
        '$0 --input config.yml --lineWidth 100 --stdout',
        'Sorts the file config.yml and output result to STDOUT wrapped to 100 columns',
    )
    .example(
        '$0 --input config.yml --indent 4 --output sorted.yml',
        'Indents with 4 spaces and outputs result to file sorted.yml.',
    )
    .option('input', {
        alias: 'i',
        describe: 'The YAML file which needs to be sorted',
        demandOption: 'Please provide an input file',
        string: true,
        array: true,
    })
    .option('output', {
        alias: 'o',
        describe: 'The YAML file to output sorted content to',
        string: true,
    })
    .option('stdout', {
        alias: 's',
        default: false,
        describe: 'Outputs the proposed sort to STDOUT only',
        boolean: true,
    })
    .option('indent', {
        alias: 'id',
        default: 2,
        describe: 'Indentation width to use (in spaces)',
        number: true,
    })
    .option('lineWidth', {
        alias: 'w',
        default: 80,
        describe: 'Wrap line width',
        number: true,
    })
    .demandOption(['input'])
    .help('h')
    .alias('h', 'help')
    .version()
    .wrap(null)
    .argv;

const yaml = require('js-yaml');
const fs = require('fs');

argv.input.forEach((file) => {
    try {
        const content = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

        const sorted = yaml.safeDump(content, {
            sortKeys: true,
            indent: argv.indent,
            lineWidth: argv.lineWidth,
        });

        if (argv.stdout) {
            console.log(sorted);
        } else {
            fs.writeFile(
                argv.output ? argv.output : file,
                sorted,
                (error) => {
                    if (error) {
                        return console.error(error);
                    }
                });
        }
    } catch (error) {
        console.error(error);
    }
});
