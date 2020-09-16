#!/bin/bash

if ((EUID != 0)); then
    echo " Please run it as Root"
    echo "sudo $0 $@"
    exit
fi

args="$@"

chmod +x install-app.sh
bash ./install-app.sh $args

if [ $? != 0 ]; then
   echo
   echo " Failed to install "
   exit 1
fi

exit
