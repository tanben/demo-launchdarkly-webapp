#!/bin/bash
#----------------------
# ld-find-code-refs
# OPTIONS: https://github.com/launchdarkly/ld-find-code-refs/blob/master/docs/CONFIGURATION.md#command-line
# REQUIRED ARGS: https://github.com/launchdarkly/ld-find-code-refs/blob/master/docs/CONFIGURATION.md#required-arguments
#----------------------

CONFIG=./terraform/development/terraform.tfvars
source $CONFIG
TOKEN="$access_token"
PROJECT="$project_key"
REPO_NAME="$project_key-repo"

DEBUG="--debug"
DRYRUN=""
#DRYRUN="--dryRun"

OPTIONS="$DEBUG $DRYRUN --accessToken $TOKEN --projKey $PROJECT  --repoName $REPO_NAME --dir ."

echo "OPTIONS=$OPTIONS"
ld-find-code-refs $OPTIONS

