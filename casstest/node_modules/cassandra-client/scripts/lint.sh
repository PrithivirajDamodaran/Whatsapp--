#!/bin/bash

./node_modules/.bin/jshint $(find ./lib/driver.js ./lib/decoder.js ./lib/system.js ./lib/uuid.js ./test -type f -name "*.js") --config jshint.json
