	//Creating a new connection pool to multiple hosts. 

	const cql = require('cassandra-driver');
	const Uuid = cql.types.Uuid;
	const casual = require('casual').en_US;
	const auth = new cql.auth.PlainTextAuthProvider('xxxxxx', 'xxxxxxx');
	const client = new cql.Client({
	    contactPoints: ['x.x.x.x'],
	    keyspace: 'demo',
	    authProvider: auth,
	    encoding: {
	        map: Map,
	        set: Set
	    }
	});

	console.log('Preparing....');
	loadData();


	function loadData() {

	    var sender = 'prithivi';
	    var recv = 'madan';
	    var msgtype = 'txt';
	    var chatid = Uuid.random();

	    for (var i = 0; i < 10000 ; i++) {

	        console.log(i);
	        for (var n = 0; n < 1000000; n++);
	        var msgsenttoserver = cql.types.TimeUuid.now()
	        var msgdata = casual.sentence;
	        var dateTime = new Date().toISOString();
	        var chatdate = new Date();
	        var members = ["madan", "prithivi"];
		    
	        var msgsentorecv = {
	            "madan": dateTime,
	            "prithivi": dateTime
	        };
	        var msgreadbyrecv = {
	            "madan": dateTime,
	            "prithivi": dateTime
	        };
	        var msg = {
	            "msgtype": msgtype,
	            "msgdata": msgdata
	        };


	        if (i % 2 == 0)
	            sentby = sender;
	        else
	            sentby = recv;


	        client.execute('INSERT INTO chatlive (chatid, members, sentby, chatdate, msg, msgsenttoserver, msgsentorecv, msgreadbyrecv) VALUES (?,?,?,?,?,?,?,?)', [chatid, members, sentby, chatdate, msg, msgsenttoserver,
	                msgsentorecv, msgreadbyrecv
	            ], {
	                prepare: true
	            },
	            function(err, result) {
	                if (err)
	                    console.log('execute failed', err);
	                else
	                    console.log('inserted');
	            }
	        );

	    }
	}
