angular.module("haxChatNoDb")

.controller("SettingsCtrl", ["$scope", "User", function($scope, User){
    $scope.data = {};
    $scope.data.newNick = "";
    $scope.data.newKeyword = "";
    
    $scope.clearField = function(field){
        $scope.data[field + ""] = "";
    }
    $scope.deleteKeyword = function(index){
        $scope.data.newSettings.keywordsList.splice(index, 1);
        
    }
    $scope.addKeyword = function(){
        $scope.data.newSettings.keywordsList.unshift($scope.data.newKeyword);
        $scope.data.newKeyword = "";
        $scope.$apply();
    };
    $scope.changeNick = function(){
        $scope.data.newNick = "";   
    }

    
    User.me(function(me){
        $scope.data.me = JSON.parse(JSON.stringify(me));
        
        $scope.data.newSettings = me.settings;
        console.log($scope.newSettings);
        $scope.$apply();
    });
    
    $scope.$on("User.update", function(msg){
        User.me(function(me){
            $scope.data.me = JSON.parse(JSON.stringify(me));
            $scope.$apply();
        });
    });
    
    $scope.$watch("data.newSettings", function(old, newvalue){
        User.updateSettings($scope.data.newSettings);
        //console.log(old, newvalue);
    }, true);
    
}]);