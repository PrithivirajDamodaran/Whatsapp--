	//Creating a new connection pool to multiple hosts. 
	//var cql = require('node-cassandra-cql');
	const cql = require('cassandra-driver');
	const Uuid = cql.types.Uuid;
	const casual = require('casual').en_US;
	const auth = new cql.auth.PlainTextAuthProvider('iccassandra', '141b8697e0bf2040cf17a9b5b11f506c');
	const client = new cql.Client({  contactPoints: ['52.43.5.154'], keyspace: 'demo', 
									 authProvider: auth,
									 encoding: {
    									map: Map,
    									set: Set
  									}
								});

	console.log('Preparing....');
	loadData();


	function loadData(){

	    var sender =  'prithivi';
	    var recv   =  'madan';
	    var msgtype = 'txt';
	    var chatid = Uuid.random();

	    for(var i = 0 ; i < 100; i++){
	    	
	    	console.log(i);
			for(var n = 0 ; n < 10000; n++);	    	
		    var msgsenttoserver = cql.types.TimeUuid.now()
	    	var msgdata = casual.sentence;
	    	var dateTime = new Date().toISOString();
	    	var chatdate =  new Date();
	    	var members = ["madan", "prithivi"];
	    	var msgsentorecv = {"madan" : dateTime, "prithivi" : dateTime};
	    	var msgreadbyrecv = {"madan" : dateTime, "prithivi" : dateTime};
	    	var msg = {"msgtype": msgtype, "msgdata" : msgdata };


	    	if (i % 2 == 0 )
	    		sentby = sender;
	    	else
	    		sentby = recv;


			client.execute('INSERT INTO chatlive (chatid, members, sentby, chatdate, msg, msgsenttoserver, msgsentorecv, msgreadbyrecv) VALUES (?,?,?,?,?,?,?,?)', 
				[chatid, members, sentby, chatdate, msg,  msgsenttoserver, 
				msgsentorecv, msgreadbyrecv],
						{ prepare: true },
						function(err, result) {
							if (err)
								console.log('execute failed',err);
							else
								console.log('inserted');
						}
		    );

		}
	}



/*
var Connection = require('cassandra-client').Connection;
var con = new Connection({host:'52.43.5.154', port:9042, keyspace:'demo', 
	user:'iccassandra', pass:'141b8697e0bf2040cf17a9b5b11f506c', cql_version: '2.0.0'});

console.log('connecting...');

con.connect(function(err) {
  if (err) console.log('conn execute failed');
  else {

      console.log('connected to successfuly to.', con);
	  con.execute('select * from example where field1=?', [1],
	  function(execerr, result) {
	  	console.log('inside', result);

	    if (execerr)
	    	console.log('query execute failed');
	    else
	    	console.log('got chat ' + result.rows[0].field1);	    
	  });
  }
});
*/
