/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require("node-uuid");

module.exports = {
	join : function(req, res){
        var user = req.param("user");
        req.socket.nickname = user.nickname;
        req.session.nickname = user.nickname;
        
        var returnUser = {
            nickname: user.nickname,
            
            rooms: {
                
            }
        };
        var newuuid = uuid.v1();
        if(!user.uuid){
            returnUser.uuid = newuuid;   
        } else {
            returnUser.uuid = user.uuid;   
        }
        console.log(returnUser.uuid);
        req.socket.uuid = returnUser.uuid;
        req.session.uuid = returnUser.uuid;
        
        for(var room in user.rooms){

            
            //grab all users in each room
            returnUser.rooms[room] = {
                name: room,
                users: {},
                chats: []
            }; 
            var subscribers = sails.sockets.subscribers(room);
            console.log(subscribers);
            
            for(var i = 0; i < subscribers.length; i++){
                /* old code using user array trying to switch to user hashmap by server generated uuid
                returnUser.rooms[room].users.push(sails.sockets.get(subscribers[i]).nickname);
                */
                
                var userInRoom = sails.sockets.get(subscribers[i]);
                console.log(userInRoom.uuid + " " + userInRoom.nickname);
                returnUser.rooms[room].users[userInRoom.uuid] =  userInRoom.nickname;
            }
            //console.log("broadcasting join of " + room);
            sails.sockets.broadcast(room, "join", {uuid: uuid.v1(), nickname: user.nickname, useruuid: returnUser.uuid, room: room, timestamp: new Date().getTime()});
            /*if(returnUser.rooms[room].users.indexOf(user.nickname) < 0){
                returnUser.rooms[room].users.push(user.nickname);
            }*/
            returnUser.rooms[room].users[returnUser.uuid] = user.nickname;
            
            //console.log(returnUser.rooms[room]);
            //join socket room
            sails.sockets.join(req.socket, room);            
        }
        res.json(returnUser);
    },
    
    joinRoom : function(req, res){
        var user = req.param("user");
        var room = req.param("room");
        var resRoom = {
            room: room,
            users: [],
            chats: []
        }
        
        var subscribers = sails.sockets.subscribers(room);
        
        for(var i = 0; i < subscribers.length; i++){
            resRoom.users.push(sails.sockets.get(subscribers[i].nickname));  
        }
        resRoom.users.push(user);
        sails.sockets.broadcast(room, "join", {uuid: uuid.v1(), nick: user, room: room});
        sails.sockets.join(req.socket, room);
            
            
        res.json(resRoom);
        
        
    },
    
    message: function(req, res){
        var nick = req.socket.nickname;
        var room = req.param("room");
        var message = req.param("message");
        
        sails.sockets.broadcast(room, "message", {uuid: uuid.v1(), type: "text", nick: nick, room: room, message: message, timestamp: new Date().getTime()});
        res.json({});
        
    },
    
    audio: function(req, res){
        res.json({});    
    }
};

