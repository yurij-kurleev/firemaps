'use strict';

let home = ($http, $cookies) => {
    let getAllObjects = () => {
        $http({
            method: 'GET',
            url: 'release.fire-group.com/api/getList?auth=' + $cookies.get('apiKey')
        }).success((response)=>{
            response = "success";
            return response;
        }).error((response)=>{
            response = "error";
            return response;
        })
    };

    let getOneObject = (imei) => {
        $http({
            method: 'GET',
            url: 'release.fire-group.com/api/getState?auth=' + $cookies.get('apiKey') + '&imei=' + imei
        })
    };

    return {
        getAllObjects,
        getOneObject
    };
};

home.$inject = [
    '$http',
    '$cookies'
];
angular.module('app').factory('home', home);