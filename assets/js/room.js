angular.module("haxChatNoDb")

.controller("RoomCtrl", ["$scope", "$stateParams", "User", function($scope, $stateParams, User){
    $scope.roomname = $stateParams.roomname;
    $scope.data = {newmessage: ""};
    
    $scope.message = function(){
        User.message($stateParams.roomname, $scope.data.newmessage);
        $scope.data.newmessage = "";
    }
    
    User.me(function(me){
        $scope.data.me = JSON.parse(JSON.stringify(me));
        $scope.$apply();
    });
    
    $scope.$on("User.update", function(msg){
        User.me(function(me){
            $scope.data.me = JSON.parse(JSON.stringify(me));
            $scope.$apply();
        });
    });
    
}]);