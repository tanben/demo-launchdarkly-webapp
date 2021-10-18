#!/bin/bash
#----------------------
# ld-find-code-refs
# OPTIONS: https://github.com/launchdarkly/ld-find-code-refs/blob/master/docs/CONFIGURATION.md#command-line
# REQUIRED ARGS: https://github.com/launchdarkly/ld-find-code-refs/blob/master/docs/CONFIGURATION.md#required-arguments
#----------------------

TOKEN="<YOUR LD ACCESS TOKEN>"
PROJECT="sample-js-demo"
REPO_NAME="sample-js-demo"

DEBUG="--debug"
DRYRUN=""
#DRYRUN="--dryRun"

OPTIONS="$DEBUG $DRYRUN --accessToken $TOKEN --projKey $PROJECT  --repoName $REPO_NAME --dir ."

echo "OPTIONS=$OPTIONS"
ld-find-code-refs $OPTIONS

