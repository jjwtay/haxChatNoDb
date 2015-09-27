angular.module("haxChatNoDb")

.factory("User", ["$rootScope", function($rootScope){
    var meStored;
    var me;
    
    //intiialize meStored object
    if(localStorage.getItem("haxChatNoDb") === null || localStorage.haxChatNoDb === 'undefined'){
        meStored = {};
        meStored.nickname = "guest" + Math.floor(Math.random()*1000);
        meStored.rooms = {};
        localStorage.haxChatNoDb = JSON.stringify(meStored);
    }
    meStored = JSON.parse(localStorage.haxChatNoDb);
    
    function join(nick, callback){
        meStored.nickname = nick;
        localStorage.haxChatNoDb = JSON.stringify(meStored); 
        io.socket.get("/user/join", {user: meStored}, function(user){
            console.log("here we go", user);
            me = user;

            $rootScope.$broadcast("User.updated", user);
            return callback(user); 
        });
    }
    function me(callback){
        if(me.nickname == undefined){
            console.log("have to rejoin with : " + meStored.nickname);
            join(meStored.nickname, function(user){
                console.log("got back", user);
                return callback(me);
            });
        } else {
            console.log("didn't have to rejoin");
            return callback(me);
        }
    }
    function joinRoom(room, callback){
        //first add it to webstorage for next time
        meStored.rooms[room] = {room : room};
        localStorage.haxChatNoDb = JSON.stringify(meStored);
        
        //second tell server and then add room to me.rooms
        io.socket.get("/user/joinRoom", {user: meStored.nickname, room: room}, function(data){
            me.rooms[room] = data;
            return callback(data);
        });
    }
    function message(room, message){
        io.socket.get("/user/message", {room: room, message: message}, function(data){
           console.log(data); 
        });
    }
    
    io.socket.on("online", function(msg){
        
    });
    io.socket.on("offline", function(msg){
        for(var room in me.rooms){
            //remove user from user array if in room
            if(me.rooms[room].users.indexOf(msg.nickname) > -1){
                me.rooms[room].users.splice(me.rooms[room].users.indexOf(msg.nickname), 1);    
            }
        }
        $rootScope.$broadcast("User.update", msg);
    });
    io.socket.on("join", function(msg){
        me.rooms[msg.room].users.push(msg.nickname);
        $rootScope.$broadcast("User.update", msg);
    });
    io.socket.on("left", function(msg){
        
    });
    io.socket.on("message", function(msg){
        me.rooms[msg.room].chats.push(msg);
        console.log(msg);
        $rootScope.$broadcast("User.update", msg);
    });
    
    return {
        join: join,
        me: me,
        joinRoom: joinRoom,
        message: message
    }
}]);