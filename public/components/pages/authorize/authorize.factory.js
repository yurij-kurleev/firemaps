'use strict';

let auth = ($cookies, $http) => {
    let authorize =  (data) => {
        return $http({
            method: 'GET',
            url: '/index.php',
            headers: {
                'Authorization': 'Basic ' + data.login + ':' + data.password
            }
        });
    };

    return {
        authorize
    };
};

auth.$inject = ['$cookies', '$http'];
angular.module('app').factory('auth', auth);