angular.module("haxChatNoDb")

.directive("chatDirective", function($sce,$timeout,$filter){
   return {
       restrict: 'AE',
       scope: {
            message: "=message"   
       },
       template: "<div style='{{style}}'><p><strong>{{message.nick}}</strong> : <span ng-bind-html='renderHTML(message.message)'></span></p><h6>{{message.timestamp|date:'medium'}}</h6></div>",
       link : function(scope, element, attrs){
            //console.log(scope.message.timestamp);
            scope.istrue = true;
            var messageAge = new Date().getTime() - scope.message.timestamp;
            //scope.messag = $sce.trustAsHtml(scope.message.message);
            
            scope.renderHTML = function(html_code){
                return $sce.trustAsHtml(fixMessage(html_code));
            };            
            if(new Date().getTime() - scope.message.timestamp < 5000){
                scope.isnew = true;
                scope.style = "background-color:aqua";
                $timeout(function(){
                    scope.style = "";
                    scope.$apply();
                }, 5000);
                //scope.$apply();
            } else {
                console.log("old message ignore"); 
                scope.isnew = false;
            }
           
            function findLinks(message){
                return $filter('linky')(message);
                
            }
            function findImages(message){
                var fixedMessage = "";
            
                //grab .jpg's
                //var jpgsarray = message.split(".jpg");
                
                //return fixedMessage;
                return message;
            }
            function fixMessage(message){
                return findLinks(findImages(message));   
            }
            
       }
   }
    
});