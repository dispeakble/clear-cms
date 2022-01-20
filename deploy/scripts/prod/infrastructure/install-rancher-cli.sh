#!/bin/bash

RANCHER_BINARY=/usr/bin/rancher
if [ ! -f "$RANCHER_BINARY" ]; then
    cp binaries/rancher /usr/bin
    chmod +x /usr/bin/rancher
fi