'use strict';
const spectrumGoals = (()=>{
    if(websocket){
        websocket({ // websocket connection
            onclose : () => { // server has closed connection
                $('#serverConnectionLost').modal();
                // check every 3s if server is alive again
                setInterval(serverStatus, 3000); 
            }
        });
    }
    window.addEventListener('scroll', function(e) {
        (window.scrollY > 1) ?  $('#accountTopInfo').fadeOut() : $('#accountTopInfo').fadeIn();
    });
    if($(window).width()>768){
    }else{
        $('#headerNavShow .btn').on('click',(event)=>{
            $('#accountTopInfo').toggle();
            $( "#headerNav" ).toggle();
        });
    }
    const spectrumGoalsObj = new Object({});
    spectrumGoalsObj.render = application.ejs;
    spectrumGoalsObj.breadCrumbs = breadCrumbs();
    application.spectrumGoals = spectrumGoalsObj;
    if(application.config.user.profile === 'teammember'){
        $('#profile').html('Team Member');
    }else if(application.config.user.profile === 'medient'){
        $('#profile').html('Medient');
    }
    return spectrumGoalsObj;
})();
/**
 * sets breadcrumbs for current page/module
 * @example spectrumGoals.breadCrumbs.set() // set breadcrumbs to current module
 */



function breadCrumbs (){
    const init = ()=>{
        const defaultModuleName = application.object[application.object.default].name,
              breadCrumbRoot = $('<a></a>').html(defaultModuleName).attr('href','#');
    
        application.object.modules.map((module)=>{
           
            application.object[module].breadcrumb = component.breadcrumb({
                breadcrumbs : [
                    breadCrumbRoot.html(),application.object[module].name
                ]
            });
        });
    };
    /**@namespace */
   const methods = {
       set : set,
       init : init
   };
   /**
    * @param {string} module 
    */
   function set(module){
        if(!module) module = application.module();
        const breadCrumbsElement = $('#pageBreadCrumbs');
        breadCrumbsElement.html(application.object[module].breadcrumb);
   }
   return methods;
}

function serverStatus(){
    $.ajax({url: '/status'}).statusCode({ 403 : function(){ 
        // no activesession generates 403 @ /status route; reload page to get /signin
        location.reload();
    }}).fail(function(){
        $('#serverConnectionLost').modal();
    }).statusCode({ 200 : function(){ 
        $('#serverConnectionLost').modal('hide');
    }});
}
