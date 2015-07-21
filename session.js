var uuid = require('node-uuid');
var Promise = require('bluebird');
var cb = require('./cb.js');
var error = require('./error.js');


//The bucket to use
var bucket = cb.bucket()

/**
 * A function to connect to Couchbase
 */
function _generateToken()
{
    return uuid.v4();
}

/**
 * Perform an authentication based on the user name and a token
 */ 
function _tokenAuth(user, token)
{
    //Get the session of the user and compare if the passed token is valid
    var key = "session::" + user;

    return new Promise(function(resolve, reject){
    
        bucket.get(key, function(err, cbres) {

            if (err)
            {
                var emsg = error.couldNotGet();
                console.log(JSON.stringify(emsg));
                console.log(JSON.stringify(err));

                reject(emsg);
            }
            else
            {
                var expected = cbres.value.token;
                
                if ( token == expected)
                {
                    resolve({ 'success' : true });
                }
                else
                {
                    resolve({ 'success' : false });
                }
            }    
        });  
    });
}


//Exports
module.exports = {
    
    generateToken : _generateToken,
    tokenAuth : _tokenAuth
}

