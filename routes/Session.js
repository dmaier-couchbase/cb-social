var express = require('express');

var helper = require('../helper.js');
var error = require('../error.js');
var cb = require('../cb.js');
var session = require('../session.js');

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
 * GET /login?user=$user&secret=$secret
 *
 * Perform a login and get a token based on a user name and a secret
 */
router.get('/login', function(req, res) {
   
    
    var user = req.query.user;
    var secret = req.query.secret;
    
    if (helper.isDefined(user) && helper.isDefined(secret))
    {
        var token = session.generateToken();
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

/**
 * GET /logout?user=$user&token=$token
 *
 * Perform a logout. A token based authentication is required
 * to perform this operation.
 */
router.get('/logout', function(req, res) {
    
    var user = req.query.user;
    var token = req.query.token;
    
    if (helper.isDefined(user) && helper.isDefined(token))
    {
    
        session.tokenAuth(user, token)
                .then(function(result){

                    var authenticated = result.success;
                
                    if ( authenticated ) {
                    
                        var key = "session::" + user; 

                        //Delete the session
                        bucket.remove(key, function(err, cbres) {

                            if (err) {

                                var emsg = error.couldNotRemove();
                                console.log(JSON.stringify(emsg));
                                console.log(JSON.stringify(err));
                                res.json(emsg);

                            }
                            else
                            {
                                console.log("Removed " + key);
                                res.json({ 'success' : true });
                            }

                        });      
                        
                    }
                    else
                    {
                        var emsg = error.authError();
                        console.log(JSON.stringify(emsg));
                        res.json(emsg);
                    }
                })
                .catch(function(error) {

                    res.json(error);

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
