'use strict'

/*
* Application Client 0.12 Dev Envoirement
* assets/js/application-dev-env.js
* TODO: 
*/
application.devLogs = [
    { 
        condition : (application.config.user.profile === null), 
        type : 'warn', 
        msg : 'user.profile is null' 
    }
];
const dev = (()=>{
    const appName = application.config.name + ' '+ application.config.version
    
    function devLog(log){
        if(log.condition)console[log.type]('application-dev-env : '+log.msg);
    }
    function devLogs(){
        application.devLogs.map((log)=>devLog(log))
    }
    
    function devCard(){
        const $mainElement = $(application.config.main),
        devStatsTabs = component.nav.tabs({tabs: [ {label:'Logs',content:'Logs'}]}),
        $devStatsElement = component.card({
            title : appName+' Development Envoirement',
            content : $(devStatsTabs).html()
        });
        $mainElement.after($devStatsElement);
    }
    if(application.config.logs) {
        console.log(appName + ' Development Envoirement')
        devLogs();
        devCard();
    }
    return {
        log : devLog
    }
})()