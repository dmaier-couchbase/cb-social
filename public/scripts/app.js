'use strict';

/**
 * @ngdoc overview
 * @name cbDemoQaApp
 * @description
 * # 'cbsocial
 *
 * Main module of the application.
 */
var app = angular.module('cbsocial', [
    'ngCookies',
    'ngResource',
    'ngRoute'
]);

app.config(function($routeProvider) {
   
    $routeProvider
    .when('/', {
       templateUrl : 'views/main.html',
       controller : 'MyCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});
