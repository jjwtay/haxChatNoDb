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
            console.log(me, user);
            for(var room in me.rooms){
                user.rooms[room].chats = me.rooms[room].chats;
            }
            me = user;
            if(!meStored.uuid){
                meStored.uuid = user.uuid;
                localStorage.haxChatNoDb = JSON.stringify(meStored);
            }
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
            /* old code using user array 
            if(me.rooms[room].users.indexOf(msg.nickname) > -1){
                me.rooms[room].users.splice(me.rooms[room].users.indexOf(msg.nickname), 1);
                console.log(me.rooms[room]);
                me.rooms[room].chats.push({uuid: msg.uuid, type:"offline", room: room, timestamp: msg.timestamp, nick: "Server", message: msg.nickname + " has disconnected"});
            } */
            console.log(msg);
            delete me.rooms[room].users[msg.useruuid];
            me.rooms[room].chats.push({uuid: msg.uuid, type:"offline", room: room, timestamp: msg.timestamp, nick: "Server", message: msg.nickname + " has disconnected"});
        }
        $rootScope.$broadcast("User.update", msg);
    });
    io.socket.on("join", function(msg){
        /* old code for usinbg users string array, swithing to users hashmap 
        me.rooms[msg.room].users.push(msg.nickname);
        */
        
        me.rooms[msg.room].users[msg.useruuid] = msg.nickname;
        
        me.rooms[msg.room].chats.push({uuid: msg.uuid, type: "joined", room: msg.room, timestamp: msg.timestamp, nick: "Server", message: msg.nickname + " has joined " + msg.room});
        $rootScope.$broadcast("User.update", msg);
    });
    io.socket.on("left", function(msg){
        
    });
    io.socket.on("message", function(msg){
        me.rooms[msg.room].chats.push(msg);
        console.log(msg);
        $rootScope.$broadcast("User.update", msg);
    });
    io.socket.on("connect", function(msg){
        join(meStored.nickname, function(user){
            console.log("got back", user);
            //return callback(me);
        });        

    });
    return {
        join: join,
        me: me,
        joinRoom: joinRoom,
        message: message
    }
}]);