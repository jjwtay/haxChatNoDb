angular.module("haxChatNoDb")

.controller("LoginCtrl", ["$scope", "User", "$state", function($scope, User, $state){
    $scope.data = {nickname : ""};
    
    $scope.join = function(){
        User.join($scope.data.nickname, function(me){
            $state.go("roomlist"); 
        });
    }
}]);