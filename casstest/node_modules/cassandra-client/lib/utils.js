/*
 *  Copyright 2011 Rackspace
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

/**
 * Wrap a function so that the original function will only be called once,
 * regardless of how  many times the wrapper is called.
 * @param {Function} fn The to wrap.
 * @return {Function} A function which will call fn the first time it is called.
 */
exports.fireOnce = function(fn) {
  var fired = false;
  return function wrapped() {
    if (!fired) {
      fired = true;
      fn.apply(null, arguments);
    }
  };
};
