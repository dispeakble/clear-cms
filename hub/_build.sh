#!/bin/sh -ex
# tip: do..
# DEV_IMAGE_TAG=$(date +%s) ./_build.sh
#...to tag image with linux timestamp
: ${DEV_IMAGE_TAG:=date +%s} # default DEV_IMAGE_TAG
IMAGE_NAME_TAG="localhost:5000/crm-hub:${DEV_IMAGE_TAG}"

get_abs_dir() {
    local d="$(\dirname ${1})"
    local f="$(\basename ${1})"
    (
        \cd ${d} >/dev/null 2>&1
        while [ -h "${f}" ]; do
            \cd $(\dirname $(\readlink ${f})) >/dev/null 2>&1
        done
        \pwd -P
    )
}

SCRIPTPATH=$(get_abs_dir "$0")

cd "$SCRIPTPATH"

docker build --squash -t "${IMAGE_NAME_TAG}" .
