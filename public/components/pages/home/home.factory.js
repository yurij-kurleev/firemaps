'use strict';

let home = ($http) => {
    let updateUserCoords = (position, user) => {
        return $http({
            method: 'POST',
            url: '/users.php',
            headers: {
                'Authorization': 'Basic ' + user.login + ':' + user.password
            },
            data: position
        });
    };

    return {
        updateUserCoords
    };
};

home.$inject = [
    '$http'
];
angular.module('app').factory('home', home);