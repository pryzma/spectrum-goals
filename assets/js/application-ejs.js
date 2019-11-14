'use strict'

/*
* Application Client 0.12 EJS integration
* assets/js/application-ejs.js
* TODO: 
*/

application.ejs = (template) =>{
    if(!template) template = application.page();
    application.render('ejs',()=> ejsTemplate(template));
}

const ejsTemplate = function(template){
    const module = application.module(); // get module object
    const templateEngine = module.templateEngine; // module template engine
    if(templateEngine ==='ejs'){ // template engine property is set to ejs
        if(ejs){ // ejs object is available
            ejs.render(template,module); // render ejs template
        }else{
            console.warn('ejs is not available')
        }
    }else{
        console.warn('ejs is called whith templateEngine '+templateEngine)
    }
    return template;
}

    