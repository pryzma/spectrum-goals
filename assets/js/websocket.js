const websocket = (args) => {
    if ('WebSocket' in window){
        const wsConnection = new WebSocket('ws://127.0.0.1:8080/');
        // websocket connection is open
        wsConnection.onopen = function(){
            if(args.onopen) args.onopen();
            //wsConnection.send(application.config.user.id);
        }
        // websocket connection is closed
        wsConnection.onclose = function(){
            if(args.onclose)args.onclose();
         } 
         wsConnection.onmessage = function(event) {
             const data = JSON.parse(event.data)
             if(data.client) wsConnection.client = data.client
             //if(!data.status) helper.modal({title:data.title,body:data.body})
         }
         window.addEventListener('unload', function(event) {
            wsConnection.close()
         });
         application.wsConnection = wsConnection
    }
}
//export default websocket;