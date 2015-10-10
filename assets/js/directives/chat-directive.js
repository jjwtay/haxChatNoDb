angular.module("haxChatNoDb")

.directive("chatDirective", function($sce,$timeout,$filter,$window){
   return {
       restrict: 'AE',
       scope: {
            message: "=message"   
       },
       template: "<div style='{{style}}'><p><strong>{{message.nick}}</strong> : <span ng-bind-html='renderHTML(message.message)'></span></p><h6>{{message.timestamp|date:'medium'}}</h6></div>",
       link : function(scope, element, attrs){
            //console.log(scope.message.timestamp);
            scope.istrue = true;
            scope.isnew = true;
            scope.isfocused = true;
            var messageAge = new Date().getTime() - scope.message.timestamp;
            //scope.messag = $sce.trustAsHtml(scope.message.message);
            
            scope.renderHTML = function(html_code){
                return $sce.trustAsHtml(fixMessage(html_code));
            };   
           
           
            $window.onfocus = function(){
                console.log('focused prepare for magic');
                scope.isfocused = true;
                if(scope.isnew){
                    $timeout(function(){
                        scope.style = "";
                        scope.isnew = false;
                        scope.$apply();
                    }, 5000);
                }
            }
            $window.onblur = function(){
                scope.isfocused = false;    
            }
            var now = new Date().getTime();
            var highlightfor = scope.message.timestamp + 5000 - now; 
            if(now - scope.message.timestamp < 5000){
                //scope.isnew = true;
                scope.style = "background-color:aqua";
                if(scope.isfocused){
                    $timeout(function(){
                        scope.style = "";
                        scope.isnew = false;
                        scope.$apply();
                    }, highlightfor);
                }
            } 
           
            function findLinks(message){
                return $filter('linky')(message);
                
            }
            function findImages(message){
                var fixedMessage = "";
            
                return message;
            }
            function fixMessage(message){
                return findLinks(findImages(message));   
            }
            
       }
   }
    
});