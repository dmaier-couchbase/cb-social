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
	  res.send('This is the User service');
});

/**
 * POST /create?email=$email&password=$pwd&first_name=$firstName&last_name=$lastName[&avatar=$avatar]
 * 
 * Creates a user
 */
router.post('/create', function(req, res) {
   
    //Mandatory parameters
    var email = req.query.email;
    var password = req.query.password;
    var first_name = req.query.first_name;
    var last_name = req.query.last_name;
    
    //Optional parameters
    var avatar = req.query.avatar;
    
    if ( helper.isDefined(email) && helper.isDefined(password) &&
         helper.isDefined(first_name) && helper.isDefined(last_name))
    {
        //Prepare the user
        var doc = {
        
            'email' : email,
            'password' : password,
            'first_name' : first_name,
            'last_name' : last_name
        };
        
        if ( helper.isDefined(avatar) ) doc.avatar = avatar;
        
        var key = "user::" + email;
        
        bucket.insert( key, doc, function(err, cbres) {
         
            if (err)
            {
                var emsg = error.couldNotAdd();
                console.log(JSON.stringify(emsg));
                console.log(JSON.stringify(err));
                res.json(emsg);
                
            }
            else
            {
                console.log("Added " + key + " to Couchbase");
                res.json({ 'success' : true });
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
 * GET /get?email=$email&user=$user&token=$token
 * 
 * Get an user by his email address. 
 * An authentication token is required in order to access this information.
 */
router.get('/get', function(req, res) {
   
    //Mandatory parameters
    var email = req.query.email;
    var user = req.query.user;
    var token = req.query.token;
    
    if (helper.isDefined(email) && helper.isDefined(token) && helper.isDefined(user))
    {
         session.tokenAuth(user, token)
            .then(function(result){
 
                var authenticated = result.success;
                
                if ( authenticated ) {
                        
                       var key = "user::" + email;   
                    
                       //Get the user and return it
                       bucket.get(key, function(err, cbres) {
                        
                           if (err) {
                                var emsg = error.couldNotGet();
                                console.log(JSON.stringify(emsg));
                                console.log(JSON.stringify(err));
                                res.json(emsg);
                            }
                            else
                            {
                                console.log(JSON.stringify(cbres));
                                res.json(cbres.value);
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
            .catch(function(error){
                
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


/**
 * POST /update[?first_name=$firstName][&last_name=$lastName][&password=$pwd][&avatar=$avatar]&user=$user&token=$token
 * 
 * Update an user. 
 * An authentication token is required in order to access this information.
 */
router.post('/update', function(req, res) {
   
    //Mandatory parameters
    var user = req.query.user;
    var token = req.query.token;
    
    //Optional parameters
    var first_name = req.query.first_name;
    var last_name = req.query.last_name;
    var password = req.query.password;
    var avatar= req.query.avatar;
    
    if (helper.isDefined(user) && helper.isDefined(token))
    {    
         session.tokenAuth(user, token)
            .then(function(result){
 
                var authenticated = result.success;
                
                
                if ( authenticated ) {
                  
                    
                       var key = "user::" + user;
                    
                       //Get the user and return it
                       bucket.get(key, function(err, cbres) {
                        
                           if (err) {
                                var emsg = error.couldNotGet();
                                console.log(JSON.stringify(emsg));
                                console.log(JSON.stringify(err));
                                res.json(emsg);
                            }
                            else
                            {
                                
                                var doc = cbres.value;
                                
                                if (helper.isDefined(first_name)) doc.first_name = first_name;
                                if (helper.isDefined(last_name)) doc.last_name = last_name;
                                if (helper.isDefined(password)) doc.password = password;
                                if (helper.isDefined(avatar)) doc.avatar = avatar;
                                
                                bucket.replace( key, doc, function(err, cbres) {

                                    if (err)
                                    {
                                        var emsg = error.couldNotUpsert();
                                        console.log(JSON.stringify(emsg));
                                        console.log(JSON.stringify(err));
                                        res.json(emsg);

                                    }
                                    else
                                    {
                                        console.log("Updated " + key);
                                        res.json({ 'success' : true });
                                    }
                                });      
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
            .catch(function(error){
                
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


/**
 * POST /add_friend?to=$to&user=$user&token=$token
 * 
 * Add a friend to the user 
 * 
 */
router.post('/add_friend', function(req, res) {

});

module.exports = router;