#!/bin/bash

#
# Copyright (c) 2023.
# Author Peter Placzek (tada5hi)
# For the full copyright and license information,
# view the LICENSE file that was distributed with this source code.
#

set -e

BASE_DIR=/usr/src/app

cd "${BASE_DIR}"

export HOST=0.0.0.0
export PORT=3000

exec npm run "$1" --workspace=packages/portal


