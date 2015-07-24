//Constants
var ERR_PARAM_MISSING = "Did you provide all mandatory parameters?";
var ERR_COULD_NOT_ADD = "Could not add the document!";
var ERR_COULD_NOT_GET = "Could not get the document!";
var ERR_COULD_NOT_UPSERT = "Could not add/update the document!";
var ERR_COULD_NOT_REMOVE = "Could not remove the document!";
var ERR_AUTH = "Authentication error";


//Exports
module.exports = {
 
    paramMissing : function() { return { "error" : ERR_PARAM_MISSING }; },
    couldNotAdd : function() { return { "error" : ERR_COULD_NOT_ADD }; },
    couldNotGet : function() { return { "error" : ERR_COULD_NOT_GET }; },
    couldNotUpsert : function() { return { "error" : ERR_COULD_NOT_UPSERT }; },
    authError : function() { return { "error" : ERR_AUTH }; },
    couldNotRemove : function() { return { "error" : ERR_COULD_NOT_REMOVE }; }
};