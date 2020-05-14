'use strict';
module.exports = () => {
    const webSocket = require('websocket'),
          webSocketServer = webSocket.server,
          http = require('http'),
          https = require('https'),
          env = process.env,
          privateKeyPath = `/etc/letsencrypt/live/${env.REF_ADR}/privkey.pem`,
          certificatePath = `/etc/letsencrypt/live/${env.REF_ADR}/fullchain.pem`
    let server;

    if(process.env.REF_HTTP_PROTOCOL === 'https'){
        const fs = require('fs');

        if( fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath) ){
            server = https.createServer({
                key: fs.readFileSync(privateKeyPath, 'utf8'),
                cert: fs.readFileSync(certificatePath, 'utf8')
            });
        }else{
            if(!fs.existsSync(privateKeyPath)) console.error('\x1b[36m',`[websocket]\x1b[0m ${privateKeyPath} does not exist`);
            if(!fs.existsSync(certificatePath)) console.error('\x1b[36m',`[websocket]\x1b[0m ${certificatePath} does not exist`);
        }

    }else{
        server = http.createServer();
    }
    const wsServerPort = env.REF_WS_PORT;
    server.listen(wsServerPort);
    server.on('upgrade', (req, socket) => {
        if (req.headers.upgrade !== 'websocket') {
          socket.end('HTTP/1.1 400 Bad Request');
          return;
        }
    });
    const wsServer = new webSocketServer({
        httpServer: server
    });
    console.log('\x1b[36m',`[websocket]\x1b[0m  Server started on ${env.REF_WS_PROTOCOL}://${env.REF_ADR}:${env.REF_WS_PORT}/ on ${(Date()).split('GMT')[0]}\x1b[0m`);
    const messages = [],clients = {};
    wsServer.on('request', function(request) {
        const wsConnectionId = require('uuid');
        console.log('\x1b[36m',`[websocket]\x1b[0m  Connection on ${request.origin} assigned to ${wsConnectionId}`);
        const wsConnection = request.accept(null, request.origin);
        clients[wsConnectionId] = wsConnection;
        wsConnection.sendUTF(JSON.stringify({client : wsConnectionId}));
        console.log('\x1b[36m',`[websocket]\x1b[0m  Client : ${wsConnectionId} in [${Object.getOwnPropertyNames(clients)}]`);
        wsConnection.on('message', function(message) {
            if (message.type === 'utf8') {
                message.from = wsConnectionId;
                message.date = (new Date().toJSON());
                messages.push(message);
                console.log('\x1b[36m',`[websocket]\x1b[0m  Message : ${JSON.stringify(message)}`);
            }
        });
        wsConnection.on('close', function() {
            delete clients[wsConnectionId];
            console.log('\x1b[36m',`[websocket]\x1b[0m  Client : ${wsConnectionId} disconnected`);
        });
        setInterval(() => {
                wsConnection.sendUTF(JSON.stringify(messages));
        },3000);
    });
};
