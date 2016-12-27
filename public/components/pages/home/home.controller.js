'use strict';

let homeController = ($scope, $cookies, home, $rootScope, $q, $window) => {
    $scope.markersList = [];
    $scope.objectsList = [];
    $scope.error = "";
    $scope.user = $cookies.getObject('user');
    $scope.location = {};

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

    //Добавить маркер на карту
    $scope.addMarker = (latitude, longitude, title="Object #" + $scope.markersList.length) => {
        if(!latitude || !longitude){
            console.log("No such object on map");
            return;
        }
        if(!$scope.markersList[title]){
            $scope.markersList[title] = L.marker([latitude, longitude]).addTo($scope.mymap);
            $scope.markersList[title]
                .bindPopup(title);
        }
        return $scope.markersList[title];
    };

    //Показать маркер из списка на карте
    $scope.showMarker = (latitude, longitude, title) => {
        let marker = $scope.addMarker(latitude, longitude, title);
        marker.openPopup();
        $scope.mymap.panTo([latitude, longitude]);
    };

    //Показать маркер пользователя на карте
    $scope.showUserMarker = (position) => {
        L.MakiMarkers.accessToken = 'pk.eyJ1IjoiZXZpbGNvcnAiLCJhIjoiY2l4MXVrZ2dtMDAwdDJ0bzNl' +
            'OHZiM3g2dSJ9.ZB-O9y9ORAuQ9AU9KcgkGQ';
        let icon = L.MakiMarkers.icon({icon: "marker", color: "#b0b", size: "l"});
        let marker = L.marker([position.latitude, position.longitude],
            {icon: icon}).addTo($scope.mymap);
        marker.bindPopup("It's you!");
        return marker;
    };

    //Обновить местоположение маркеров
    $scope.refreshMarkers = () => {
        let tmpMarkersList = $scope.markersList;
        if(!tmpMarkersList){
            return;
        }
        $scope.markersList = [];
        for(let i in tmpMarkersList){//Object #1
            for(let j in $scope.objectsList){//0
                if(i == $scope.objectsList[j].login){
                    $scope.addMarker($scope.objectsList[j].latitude, $scope.objectsList[j].longitude, i);
                    break;
                }
            }
        }
    };

    $scope.getLocation = () => {
        let deferred = $q.defer();
        if (navigator.geolocation) {
            let options = {
                enableHighAccuracy: true,
                timeout: 5000
            };
            navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, options);
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            deferred.reject(new Error('Your browser does not support Geo Location.'));
        }
        return deferred.promise;
    };

    $scope.$on('$viewContentLoaded', () => {
        if(!$scope.user){
            $window.location.href = "#/authorize";
        } else {
            $scope.getLocation().then((position)=>{
                home.updateUserCoords(position.coords, $scope.user)
                    .success((response) => {
                        $scope.objectsList = response;
                    })
                    .error((error) => {
                        $scope.error = error;
                    });
                $scope.showUserMarker(position.coords).openPopup();
                $scope.mymap.panTo([position.coords.latitude, position.coords.longitude]);
            });
            $scope.initMap();
        }
    });

    //Отправка новых координат и обновление объектов
    setInterval(()=>{
        $scope.$apply(()=>{
            $scope.getLocation().then((position)=>{
                home.updateUserCoords(position.coords, $scope.user)
                    .success((response) => {
                        $scope.objectsList = response;
                        $scope.clearMap($scope.showUserMarker(position.coords));
                        $scope.refreshMarkers();
                    })
                    .error((error) => {
                        $scope.error = error;
                    });
            });
        });
    }, 10000);

    $scope.clearMap = (userMarker) => {
        for(let i in $scope.markersList){
            $scope.mymap.removeLayer($scope.markersList[i]);
        }
        $scope.mymap.removeLayer(userMarker);
    };

};

homeController.$inject = [
    '$scope',
    '$cookies',
    'home',
    '$rootScope',
    '$q',
    '$window'
];

angular.module('app').controller('homeController', homeController);