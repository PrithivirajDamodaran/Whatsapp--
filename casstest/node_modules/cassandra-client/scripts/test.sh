if [ $TRAVIS ]; then
  dependencies=""
else
  dependencies="--dependencies test/dependencies.json"
fi

if [ ! $TEST_FILES ]; then
  TEST_FILES=$(find test/ -type f -name "test_*.js" -print0 | tr "\0" " " | sed '$s/.$//')
fi

NODE_PATH=lib node_modules/whiskey/bin/whiskey \
  --tests "${TEST_FILES}" \
  ${dependencies} --real-time --scope-leaks --timeout 90000
