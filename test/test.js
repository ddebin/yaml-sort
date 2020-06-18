#!/usr/bin/env node

'use strict';

const test = require('tape');
const spawn = require('tape-spawn');
const opts = {cwd: __dirname};

test('CLI w/o arg', (t) => {
    const proc = spawn(t, '../yaml-sort.js', opts);
    proc.exitCode(1);
    proc.stderr.match(/Missing required argument: input/);
    proc.end();
});

test('CLI w/ arg', (t) => {
    const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout', opts);
    proc.exitCode(0);
    proc.stdout.match('a: \'Lorem ipsum dolor sit amet, consectetur adipiscing elit...\'\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n' +
        '\n');
    proc.end();
});

test('CLI --output', (t) => {
    const proc = spawn(t,
        '../yaml-sort.js --input test.yml --output output.yml' +
        ' && cat output.yml' +
        ' && rm -f output.yml', opts);
    proc.exitCode(0);
    proc.stdout.match('a: \'Lorem ipsum dolor sit amet, consectetur adipiscing elit...\'\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n');
    proc.end();
});

test('CLI --indent', (t) => {
    const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout --indent 4', opts);
    proc.exitCode(0);
    proc.stdout.match('a: \'Lorem ipsum dolor sit amet, consectetur adipiscing elit...\'\n' +
        'b:\n' +
        '    b: 35\n' +
        '    c:\n' +
        '        d: false\n' +
        '\n');
    proc.end();
});

test('CLI --lineWidth', (t) => {
    const proc = spawn(t, '../yaml-sort.js --input test.yml --stdout --lineWidth 40', opts);
    proc.exitCode(0);
    proc.stdout.match('a: >-\n' +
        '  Lorem ipsum dolor sit amet, consectetur\n' +
        '  adipiscing elit...\n' +
        'b:\n' +
        '  b: 35\n' +
        '  c:\n' +
        '    d: false\n' +
        '\n');
    proc.end();
});

test('CLI --check FAIL', (t) => {
    const proc = spawn(t,
        '../yaml-sort.js --input test.yml --check', opts);
    proc.exitCode(1);
    proc.stdout.match('');
    proc.stderr.match('\'test.yml\' is not sorted and/or formatted (indent, line width).\n');
    proc.end();
});

test('CLI --lineWidth SUCCESS', (t) => {
    const proc = spawn(t,
        '../yaml-sort.js --input test.yml --output output.yml' +
        ' && ../yaml-sort.js --input output.yml --check' +
        ' && rm -f output.yml', opts);
    proc.exitCode(0);
    proc.stdout.match('');
    proc.end();
});
