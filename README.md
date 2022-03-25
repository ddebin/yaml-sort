![Node.js CI](https://github.com/ddebin/yaml-sort/workflows/Node.js%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/yaml-sort.svg)](https://www.npmjs.com/package/yaml-sort)

# About

`yaml-sort` sorts [YAML](https://yaml.org/) files alphabetically.

This tool is basically a tiny wrapper around [js-yaml](https://github.com/nodeca/js-yaml).

(Inspired by [yml-sorter](https://github.com/42BV/yml-sorter))

# Installation

`npm install -g yaml-sort`

# Usage

```
Usage: yaml-sort [options]

Options:
  -i, --input         The YAML file(s) which needs to be sorted  [array] [default: "-"]
  -o, --output        The YAML file to output sorted content to  [string]
  -s, --stdout        Output the proposed sort to STDOUT only  [boolean]
  -k, --check         Check if the given file(s) is already sorted  [boolean]
      --indent, --id  Indentation width to use (in spaces)  [number] [default: 2]
  -e, --encoding      Input encoding  [choices: "ascii", "utf8", "utf16le"] [default: "utf8"]
  -q, --quotingStyle  Strings will be quoted using this quoting style  [choices: "single", "double"] [default: "single"]
  -w, --lineWidth     Wrap line width (-1 for unlimited width)  [number] [default: 80]
  -h, --help          Show help  [boolean]
      --version       Show version number  [boolean]

Examples:
  yaml-sort --input config.yml                                 Sorts alphabetically and overwrites the file config.yml
  yaml-sort --input config.yml --lineWidth 100 --stdout        Sorts the file config.yml and output result to STDOUT wrapped to 100 columns
  yaml-sort --input config.yml --indent 4 --output sorted.yml  Indents with 4 spaces and outputs result to file sorted.yml
  cat config.yml | yaml-sort                                   Sorts alphabetically from STDIN
```