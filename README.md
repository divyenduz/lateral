# Introduction

Lateral is a CLI base parallel job executor. 

# Development

## Install

1. `yarn install`

Runs: `deno install -f --allow-run --allow-env lateral src/index.ts`

## Dev

1. Create `commands.txt` with some basic commands. 
2. Run `yarn dev`

Runs: `yarn -s fmt && cat commands.txt | lateral --reload --delay 0 --timeout 2`