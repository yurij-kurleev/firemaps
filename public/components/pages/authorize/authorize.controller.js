'use strict';

let authorizeController = ($scope, auth, $cookies, $window) => {
    $scope.formData = {};
    document.body.classList.add("blue");
    document.body.classList.add("lighten-5");

    $scope.authorize = () => {
        auth.authorize($scope.formData).success((response)=>{
            $scope.user = response;
            $cookies.putObject('user', $scope.user);
            $window.location.href = "#/home";
        })
            .error((response) => {
                console.log(response);
                $scope.error = "Неверный логин или пароль!";
                $scope.showError("error");
            });
    };

    $scope.showError = (blockId) => {
        let block = document.getElementById(blockId);
        if(block.style.display == "block"){
            block.style.display = "none";
        }
        else{
            block.style.display = "block";
            setTimeout(() => {block.style.display = "none"}, 10000);
        }
    };
};

authorizeController.$inject = [
    '$scope',
    'auth',
    '$cookies',
    '$window'
];

angular.module('app').controller('authorizeController', authorizeController);