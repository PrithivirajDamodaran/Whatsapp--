/**
 *  Copyright 2014 Rackspace
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

var util = require('util');



/**
 * Error for when the client times out a query.
 * @constructor
 *
 * @param {String} message The error message.
 */
function ClientTimeoutError(message) {
  Error.call(this, message);
  this.name = 'ClientTimeoutException';
}
util.inherits(ClientTimeoutError, Error);



exports.ClientTimeoutError = ClientTimeoutError;
