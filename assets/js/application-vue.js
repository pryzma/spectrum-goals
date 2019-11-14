'use strict'

/*
* Application Client 0.12 Vue.js integration
* assets/js/application-backbone.js
* TODO: 
*/




const vue = function(obj){ // Vue mediator
    if(Vue ){
        if(obj){
            obj.el ? obj.el : application.config.view.default;
            console.log(obj)
            application.render('vue',()=> new Vue(obj) )
        }
       
    }else{
        console.log("application-vue : Vue is not available")
    }
}
application.vue = vue;