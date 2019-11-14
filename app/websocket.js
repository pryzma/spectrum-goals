
module.exports = (app) => {

    const webSocket = require('websocket'),
          webSocketServer = webSocket.server,
          http = require('http'),
          server = http.createServer();

    const env = process.env;
    const wsServerPort = env.REF_WS_PORT;
    server.listen(wsServerPort);
    server.on('upgrade', (req, socket) => {
        // Make sure that we only handle WebSocket upgrade requests
        if (req.headers['upgrade'] !== 'websocket') {
          socket.end('HTTP/1.1 400 Bad Request');
          return;
        }
        // More to come…
        });
    const wsServer = new webSocketServer({
        httpServer: server
    });
    
    console.log('\x1b[36m',`[websocket]\x1b[0m  Server started on ws://${env.REF_ADR}:${env.REF_WS_PORT}/ on ${(Date()).split('GMT')[0]}\x1b[0m`)
    
    const getUniqueID = () => { // generate unique id
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4();
    };
    const messages = [],clients = {};
    wsServer.on('request', function(request) {
        // assign user id to request
        //const userID = app.user.id ? app.user.id : getUniqueID(); 
        const userID = getUniqueID();
        console.log('\x1b[36m',`[websocket]\x1b[0m  Connection on ${request.origin} assigned to ${userID}`);
        // rewrite this to accept only requests from allowed origin
        const connection = request.accept(null, request.origin);
        // assign id to client connection
        clients[userID] = connection;
        // send asigned id to client
        connection.sendUTF(JSON.stringify({client : userID}));
        // print client connection to console
        console.log('\x1b[36m',`[websocket]\x1b[0m  Client : ${userID} in [${Object.getOwnPropertyNames(clients)}]`)
        // server recieved message 
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
            
                message.from = userID;
                message.date = (new Date().toJSON());
                messages.push(message);
                // print recieved message to console
                console.log('\x1b[36m',`[websocket]\x1b[0m  Message : ${JSON.stringify(message)}`)
                console.log(messages); // print current messages to console
            }
        });
        // user disconnected
        connection.on('close', function(connection) {
            // remove user from the list of connected clients
            delete clients[userID];
            console.log('\x1b[36m',`[websocket]\x1b[0m  Client : ${userID} disconnected`); 
        
        });
        setInterval(() => {
            //console.log(`Socket sendMessage : ${sendMessage}`)
            
            //if(lastuser != userID && messages.length > messagesLength){
                connection.sendUTF(JSON.stringify(messages));
                //sendMessage = false
                //messagesLength = messages.length;
                //lastuser = userID;
            //}
            
           
        },3000);
       
    });
   
}

