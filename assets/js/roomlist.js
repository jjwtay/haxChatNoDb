angular.module("haxChatNoDb")

.controller("RoomlistCtrl", ["$scope", "User", function($scope, User){
    $scope.data = {join:"", me: {}};

    User.me(function(me){
        $scope.data.me = JSON.parse(JSON.stringify(me)); 
        console.log($scope.data.me);
        $scope.$apply();
    });
    
    $scope.join = function(){
        User.joinRoom($scope.data.join, function(room){
            $scope.data.join = "";
            $scope.data.me.rooms[room.room] = room;
            $scope.$apply();
        });   
    }
    
    /*$scope.$on("Room.join", function(event, msg){
        console.log(msg);
        $scope.data.me.rooms[msg.room].users.push(msg.nickname);
        $scope.$apply();
    });*/
    $scope.$on("User.update", function(event, msg){
        //reset data
        console.log("User update coming");
        User.me(function(me){
           $scope.data.me = JSON.parse(JSON.stringify(me));
            $scope.$apply();
        });
    });

}]);