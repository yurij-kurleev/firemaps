'use strict';

let home = ($http) => {
    let updateUserCoords = (position, user) => {
        return $http({
            method: 'POST',
            url: '/users',
            headers: {
                'Authorization': 'Basic ' + user.login + ':' + user.password
            },
            data: data
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