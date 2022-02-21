
#!/bin/bash
DEV_DIR=./terraform/development
HOME_DIR=$PWD
OUTPUT=$HOME_DIR/.webconfig.js
pushd .
cd $DEV_DIR
terraform output -json | jq '.config.value'| awk 'BEGIN{ print "var webconfig=" }{print $0}END{print ";"}' >  $OUTPUT
popd