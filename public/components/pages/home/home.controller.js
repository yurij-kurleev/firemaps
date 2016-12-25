'use strict';

let homeController = ($scope, $cookies, home, $rootScope, $q) => {
    $scope.markersList = [];
    $scope.objectsList = [
        {name:"Object #1", speed: 25, latitude: 46.45, longitude: 30.72},
        {name:"Object #2", speed: 5, latitude: 46.46, longitude: 30.73}
        ];
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

    //Добавить маркер из списка на карту
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

    $scope.setUserMarker = (position) => {
        L.MakiMarkers.accessToken = 'pk.eyJ1IjoiZXZpbGNvcnAiLCJhIjoiY2l4MXVrZ2dtMDAwdDJ0bzNl' +
            'OHZiM3g2dSJ9.ZB-O9y9ORAuQ9AU9KcgkGQ';
        let icon = L.MakiMarkers.icon({icon: "marker", color: "#b0b", size: "l"});
        let marker = L.marker([position.latitude, position.longitude],
            {icon: icon}).addTo($scope.mymap);
        marker.bindPopup("It's you!");
        return marker;
    };

    $scope.$on('$viewContentLoaded', () => {
        $scope.getLocation().then((position)=>{
            /*home.updateUserCoords(position.coords, $scope.user)
                .success((response) => {
                    $scope.objectsList = response;
                })
                .error((error) => {
                    $scope.error = error;
                });*/
            $scope.initMap();
            $scope.setUserMarker(position.coords).openPopup();
            $scope.mymap.panTo([position.coords.latitude, position.coords.longitude]);
        });
    });

    //Отправка новых координат и обновление объектов
    setInterval(()=>{
        $scope.$apply(()=>{
            $scope.getLocation().then((position)=>{
                /*home.updateUserCoords(position.coords, $scope.user)
                    .success((response) => {
                        $scope.objectsList = response;
                    })
                    .error((error) => {
                        $scope.error = error;
                    });*/
                $scope.clearMap($scope.setUserMarker(position.coords));
            });
        });
    }, 10000);

    $scope.clearMap = (userMarker) => {
        console.log($scope.markersList);
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
    '$q'
];

angular.module('app').controller('homeController', homeController);