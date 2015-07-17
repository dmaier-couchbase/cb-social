var services = angular.module('cbsocial');

services.factory('MyService', function($http) {
   
    var myService = new TMyService($http);
    
    return myService;
});