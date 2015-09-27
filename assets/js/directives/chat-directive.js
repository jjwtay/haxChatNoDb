angular.module("haxChatNoDb")

.directive("chatDirective", function(){
   return {
       restrict: 'AE',
       scope: {
            message: "=message"   
       },
       template: "<div ng-class='{newmessage: isnew}'><p><strong>{{message.nick}}</strong> : {{message.message}}</p><h6>{{message.timestamp|date:'medium'}}</h6></div>",
       link : function(scope, elemetn, attrs){
            //console.log(scope.message.timestamp);
            scope.istrue = true;
            var messageAge = new Date().getTime() - scope.message.timestamp;
            if(messageAge < 5000){
                //console.log("new message set timeout");
                scope.isnew = true;
            } else {
                console.log("old message ignore"); 
                scope.isnew = false;
            }
       }
   }
    
});