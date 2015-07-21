var express = require('express');

var helper = require('../helper.js');
var error = require('../error.js');
var cb = require('../cb.js');
var session = require('../session.js');

//This provides everytime a token
var ADMIN_USER = 'admin';
var ADMIN_PWD = 'socialized';


//The router to use
var router = express.Router();

//The bucket to use
var bucket = cb.bucket();


/**
 * GET /
 * 
 * Returns details about the service
 */
router.get('/', function(req, res) {
	  res.send('This is the Sessions service');
});


/**
 * GET /token?user=$user&secret=$secret
 *
 * Get a token based on a user name and a secret
 */
router.get('/token', function(req, res) {
   
    
    var user = req.query.user;
    var secret = req.query.secret;
    
    if (helper.isDefined(user) && helper.isDefined(secret))
    {
        var token = session.generateToken();
        
        //Return a token for user admin - only for testing
        if (user == ADMIN_USER && secret == ADMIN_PWD )
        {
            var result = { 'user' : ADMIN_USER, 'token' : token };
            res.json(result);
        }
        
        var key = "user::" + user;
        
        //Get the user
        bucket.get(key, function(err, cbres) {
          
            if (err)
            {
                var emsg = error.couldNotGet();
                console.log(JSON.stringify(emsg));
                console.log(JSON.stringify(err));
                res.json(emsg);
                
            }
            else
            {
                console.log("Got " + JSON.stringify(cbres));
                var value = cbres.value;
                
                if ( value.password == secret)
                {
                    var key = "session::" + user;
                    var doc = { 'user' : user, 'token' : token }; 
                    
                    //Add a session token
                    bucket.upsert( key, doc, function(err, cbres) {
                    
                        if (err)
                        {
                            var emsg = error.couldNotUpsert();
                            console.log(JSON.stringify(emsg));
                            console.log(JSON.stringify(err));
                            res.json(emsg);    
                        }
                        else
                        {
                            console.log("Added/updated " + key);
                            res.json(doc);
                        }
                    });
                }
            }
            
        }); 
    }
    else
    {
        var emsg = error.paramMissing();
        console.log(JSON.stringify(emsg)); 
        res.json(emsg);
    }
});

module.exports = router;
