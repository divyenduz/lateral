# Introduction

Lateral is a CLI base parallel job executor.

# Usage

## Install

`deno install -f --allow-run --allow-env lateral src/index.ts`

## API

| Argument    | Description                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--delay`   | `--delay X` will make sure there is at least `X` seconds between each start.                                                  |
| `--timeout` | `If jobs taking more than a certain amount of time are known to fail, they can be stopped with --timeout X. X is in seconds.` |

# Development

## Install

1. `yarn install`

Runs: `deno install -f --allow-run --allow-env lateral src/index.ts`

## Dev

1. Create `commands.txt` with some basic commands.
2. Run `yarn dev`

Runs: `yarn -s fmt && cat commands.txt | lateral --reload --delay 0 --timeout 2`
