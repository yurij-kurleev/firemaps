'use strict';

let homeController = ($scope, home) => {
    $scope.markersList = [];
    $scope.objectsList = [];
    $scope.initMap = () => {
        $scope.mymap = L.map('mapid').setView([46.47, 30.7], 14);
        L.tileLayer('https://api.tiles.mapbox.com/v4/evilcorp.2f14jke2/{z}/{x}/{y}.png?' +
            'access_token=pk.eyJ1IjoiZXZpbGNvcnAiLCJhIjoiY2l4MXVrZ2dtMDAwdDJ0bzNlOHZ' +
            'iM3g2dSJ9.ZB-O9y9ORAuQ9AU9KcgkGQ',
            {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
                '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                'CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 20,
                id: 'evilcorp.2f14jke2',
                accessToken: 'pk.eyJ1IjoiZXZpbGNvcnAiLCJhIjoiY2l4MXVrZ2dtMDAwdDJ0bzNlOHZiM3' +
                'g2dSJ9.ZB-O9y9ORAuQ9AU9KcgkGQ'
            }).addTo($scope.mymap);
    };

    $scope.getAllObjects = () => {

    };

    $scope.$on('$viewContentLoaded', () => {
        $scope.initMap();
        $scope.getAllObjects();
    });

    setInterval($scope.getAllObjects, 3000);

    $scope.addMarker = (latitude, longitude, title = "It's me!") => {
        if(!latitude || !longitude){
            console.log("No such object on map");
            return;
        }
        let marker = L.marker([latitude, longitude]).addTo($scope.mymap);
        $scope.markersList.push(marker);
        $scope.markersList[$scope.markersList.length - 1]
            .bindPopup(title).openPopup();
        $scope.mymap.panTo([latitude, longitude]);
    };

    $scope.clearMap = () => {
        console.log($scope.markersList);
        for(let i in $scope.markersList){
            $scope.mymap.removeLayer($scope.markersList[i]);
        }
    };

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();
        $scope.addMarker($scope.lat, $scope.lng, "Yurij");
    };

    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred.";
                break;
        }
        $scope.$apply();
    };

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    $scope.getLocation();
};

homeController.$inject = [
    '$scope',
    'home'
];

angular.module('app').controller('homeController', homeController);