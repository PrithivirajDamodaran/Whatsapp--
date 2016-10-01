# node-cassandra-client

node-cassandra-client is a [Node.js](http://nodejs.org) CQL 2 driver for [Apache Cassandra](http://cassandra.apache.org) 0.8 and later.

CQL is a query language for Apache Cassandra.  You use it in much the same way you would use SQL for a relational database.
The Cassandra [documentation](http://www.datastax.com/docs/1.0/references/cql/index) can help you learn the syntax.

## node-cassandra-client and Apache Cassandra 1.2.x

Since `0.14.1`, the client supports Apache Cassandra 1.2.x in CQL 2
compatibility mode.

By default Cassandra 1.2.x uses CQL 3 so you need to turn the CQL 2
compatibility mode on by passing `'cql_version': '2.0.0'` attribute to
`Connection` / `PooledConnection` constructor in the options object.

Explicitly setting CQL version on a connection is only supported from
Apache Cassandra 1.1 and above so you should only set it if you are
using version 1.1 or above.

For example:

```javascript
var conn = new Connection({'host': host, 'port': port, 'keyspace': 'Keyspace1', 'cql_version': '2.0.0'});
var pool = new PooledConnection({'hosts': hosts, 'keyspace': 'Keyspace1', 'cql_version': '2.0.0'});
```

### Creating column families using cqlsh

If you use `cqlsh` which ships with Cassandra 1.2.x or a newer version of
`cqlsh` which defaults to CQL 3 you need to pass `-2` argument to it, otherwise
the client won't be able to read column family definitions (#67).

For example:

```bash
cqlsh -2 localhost 9160 < my_file.cql
```

## Installation

    $ npm install cassandra-client

## Build status

[![Build Status](https://secure.travis-ci.org/racker/node-cassandra-client.png)](http://travis-ci.org/racker/node-cassandra-client)

## Running Tests and Lint

```bash
npm run-script test
npm run-script lint
```

## License

node-cassandra-client is distributed under the [Apache license](http://www.apache.org/licenses/LICENSE-2.0.html).

[lib/bigint.js](https://github.com/racker/node-cassandra-client/blob/master/lib/bigint.js) is [borrowed](https://github.com/joyent/node/blob/master/deps/v8/benchmarks/crypto.js)
from the Node.js source (which comes from the [V8](http://code.google.com/p/v8/) source).


## Using It

### Access the System keyspace
    var System = require('cassandra-client').System;
    var sys = new System('127.0.0.1:9160');

    sys.describeKeyspace('Keyspace1', function(err, ksDef) {
      if (err) {
        // this code path is executed if the key space does not exist.
      } else {
        // assume ksDef contains a full description of the keyspace (uses the thrift structure).
      }
    });

### Create a keyspace
    sys.addKeyspace(ksDef, function(err) {
      if (err) {
        // there was a problem creating the keyspace.
      } else {
        // keyspace was successfully created.
      }
    });

### Updating
This example assumes you have strings for keys, column names and values:

    var Connection = require('cassandra-client').Connection;
    var con = new Connection({host:'cassandra-host', port:9160, keyspace:'Keyspace1', user:'user', pass:'password'});
    con.connect(function(err, con) {
      if (err) {
        // Failed to establish connection.
        throw err;
      }

      con.execute('UPDATE Standard1 SET ?=? WHERE key=?', ['cola', 'valuea', 'key0'], function(err) {
          if (err) {
              // handle error
          } else {
              // handle success.
          }
      });
    });

The `Connection` constructor accepts the following properties:

    host:        cassandra host
    port:        cassandra port
    keyspace:    cassandra keyspace
    user:        [optional] cassandra user
    pass:        [optional] cassandra password
    use_bigints: [optional] boolean. toggles whether or not BigInteger or Number instances are in results.
    timeout:     [optional] number. Connection timeout. Defaults to 4000ms.
    log_time:    [optional] boolean. Log execution time for all the queries.

### Getting data

**NOTE:** You'll only get ordered and meaningful results if you are using an order-preserving partitioner.
Assume the updates have happened previously.

```javascript
  con.execute('SELECT ? FROM Standard1 WHERE key >= ? and key <= ?', ['cola', 'key0', 'key1'], function (err, rows) {
    if (err) {
      // handle error
    } else {
      console.log(rows.rowCount());
      console.log(rows[0]);
                        assert.strictEqual(rows[0].colCount(), 1);
                        assert.ok(rows[0].colHash['cola']);
                        assert.ok(rows[0].cols[0].name === 'cola');
                        assert.ok(rows[0].cols[0].value === 'valuea');
    }
  });
```

### Pooled Connections
    // Creating a new connection pool.
    var PooledConnection = require('cassandra-client').PooledConnection;
    var hosts = ['host1:9160', 'host2:9170', 'host3', 'host4'];
    var connection_pool = new PooledConnection({'hosts': hosts, 'keyspace': 'Keyspace1'});

PooledConnection() accepts an objects with these slots:

         hosts : String list in host:port format. Port is optional (defaults to 9160).
      keyspace : Name of keyspace to use.
          user : User for authentication (optional).
          pass : Password for authentication (optional).
       maxSize : Maximum number of connection to pool (optional).
    idleMillis : Idle connection timeout in milliseconds (optional).
    use_bigints: boolean indicating whether or not to use BigInteger or Number in numerical results.
    timeout:   : [optional] number. Connection timeout. Defaults to 4000ms.
    log_time   : [optional] boolean. Log execution time for all the queries.
                 Timing is logged to 'node-cassandra-client.driver.timing' route. Defaults to false.

Queries are performed using the `execute()` method in the same manner as `Connection`,
(see above).  For example:

    // Writing
    connection_pool.execute('UPDATE Standard1 SET ?=? WHERE KEY=?', ['A', '1', 'K'],
      function(err) {
        if (err) console.log("failure");
        else console.log("success");
      }
    );

    // Reading
    connection_pool.execute('SELECT ? FROM Standard1 WHERE KEY=?', ['A', 'K'],
      function(err, row) {
        if (err) console.log("lookup failed");
        else console.log("got result " + row.cols[0].value);
      }
    );

When you are finished with a `PooledConnection` instance, call `shutdown(callback)`.
Shutting down the pool prevents further work from being enqueued, and closes all
open connections after pending requests are complete.

    // Shutting down a pool
    connection_pool.shutdown(function() { console.log("connection pool shutdown"); });

### Logging

Instances of `Connection()` and `PooledConnection()` are `EventEmitter`'s and emit `log` events:

    var Connection = require('cassandra-client').Connection;
    var con = new Connection({host:'cassandra-host', port:9160, keyspace:'Keyspace1', user:'user', pass:'password'});
    con.on('log', function(level, message, obj) {
      console.log('log event: %s -- %j', level, message);
    });

The `level` being passed to the listener can be one of `debug`, `info`, `warn`, `error`, `timing` and `cql`. The `message` is a string and `obj` is an object that provides more detailed information.

## Regenerating Thrift Definition Files

To regenerate Thrift definition files you need to have thrift compiler
installed. You can find information on how to do that on the
[Thrift website](http://thrift.apache.org/docs/install/).

```bash
git clone git://github.com/apache/cassandra.git
cd cassandra/interface
thrift --gen js:node cassandra.thrift
```

## Things you should know about

### Numbers

The Javascript Number type doesn't match up well with the java longs and integers stored in Cassandra.
Therefore all numbers returned in queries are BigIntegers.  This means that you need to be careful when you
do updates.  If you're worried about losing precision, specify your numbers as strings and use the BigInteger library.

### Decoding

node-cassandra-client supports Cassandra `BytesType`, `IntegerType`, `LongTime` and `TimeUUIDType` out of the box.
When dealing with numbers, the values you retreive out of rows will all be `BigInteger`s (be wary of losing precision
if your numbers are bigger than 2^53--you know, like a timestamp).

`BigInteger` supports many operations like add, subtract, multiply, etc., and a few others that may come in handy: shift, square, abs, etc.  Check the source if you'd like to know more.

We technically have a [UUID type](https://github.com/racker/node-cassandra-client/blob/master/lib/uuid.js), but have not had the need to flesh it out yet.  If you find the need to expose more parts of the UUID (timestamp, node, clock sequence, etc.), or would like to implement some operations, patches are welcome.

### Todo

* Full BigInteger documentation.
