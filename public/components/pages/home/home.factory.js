'use strict';

let home = ($http) => {
    let updateUserCoords = (position, user) => {
        return $http({
            method: 'GET',
            url: ''
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