const spectrumGoals = (()=>{

    if(websocket){
        websocket({ // websocket connection
            onclose : () => { // server has closed connection
                $('#serverConnectionLost').modal()
                // check every 3s if server is alive again
                setInterval(serverStatus, 3000); 
            }
        });
    }
    const spectrumGoalsObj = new Object;
    spectrumGoalsObj.render = application.ejs 
    spectrumGoalsObj.breadcrumbs = breadCrumbs;
    application.spectrumGoals = spectrumGoalsObj;
    return spectrumGoalsObj;
})()

function breadCrumbs(){
    const breadCrumbRoot = $('<a></a>').html(application.object[application.object.default].name).attr('href','#').html();
    application.object.modules.map((module)=>{
        application.object[module].breadcrumbs = application.object[module].name
    })
}

function serverStatus(){
    $.ajax({url: '/status'}).statusCode({ 403 : function(){ 
        // no activesession generates 403 @ /status route; reload page to get /signin
        location.reload()
    }}).fail(function(){
        $('#serverConnectionLost').modal()
    });
}

