/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
        for(var room in user.rooms){

            
            //grab all users in each room
            returnUser.rooms[room] = {
                name: room,
                users: [],
                chats: []
            }; 
            var subscribers = sails.sockets.subscribers(room);
            for(var i = 0; i < subscribers.length; i++){
                returnUser.rooms[room].users.push(sails.sockets.get(subscribers[i]).nickname);
            }
            //console.log("broadcasting join of " + room);
            sails.sockets.broadcast(room, "join", {nickname: user.nickname, room: room});
            if(returnUser.rooms[room].users.indexOf(user.nickname) < 0){
                returnUser.rooms[room].users.push(user.nickname);
            }
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
        sails.sockets.broadcast(room, "join", {nick: user, room: room});
        sails.sockets.join(req.socket, room);
            
            
        res.json(resRoom);
        
        
    },
    
    message: function(req, res){
        var nick = req.socket.nickname;
        var room = req.param("room");
        var message = req.param("message");
        
        sails.sockets.broadcast(room, "message", {type: "text", nick: nick, room: room, message: message, timestamp: new Date().getTime()});
        res.json({});
        
    },
    
    audio: function(req, res){
        res.json({});    
    }
};

