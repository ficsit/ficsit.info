#!/usr/bin/env bash
set -e

DESTINATION=./.community-resources
TARGET_REF="${1:-master}"

if [[ ! -d "${DESTINATION}" ]]; then
  git clone \
    https://github.com/ficsit/community-resources \
    --quiet \
    --reference-if-able ../community-resources \
    -n \
    "${DESTINATION}"
fi

cd "${DESTINATION}"
git fetch --quiet --tags --force --prune-tags origin
git checkout --quiet "${TARGET_REF}"

