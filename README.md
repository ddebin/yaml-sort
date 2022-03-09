![Node.js CI](https://github.com/ddebin/yaml-sort/workflows/Node.js%20CI/badge.svg)

# About

`yaml-sort` is a CLI tool sorting alphabetically [YAML](https://yaml.org/) files.

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
  -s, --stdout        Output the proposed sort to STDOUT only  [boolean] [default: false]
  -k, --check         Check if the given file(s) is already sorted  [boolean] [default: false]
      --indent, --id  Indentation width to use (in spaces)  [number] [default: 2]
  -e, --encoding      Input encoding  [choices: "ascii", "utf8", "utf16le"] [default: "utf8"]
  -w, --lineWidth     Wrap line width  [number] [default: 80]
  -h, --help          Show help  [boolean]
      --version       Show version number  [boolean]

Examples:
  yaml-sort --input config.yml                                 Sorts alphabetically and overwrites the file config.yml
  yaml-sort --input config.yml --lineWidth 100 --stdout        Sorts the file config.yml and output result to STDOUT wrapped to 100 columns
  yaml-sort --input config.yml --indent 4 --output sorted.yml  Indents with 4 spaces and outputs result to file sorted.yml
  cat config.yml | yaml-sort                                   Sorts alphabetically from STDIN
```