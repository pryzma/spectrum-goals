
/*
// Application Client Envoirement
// 
import {client} from 'ace'
const app = new client; 
app.model([{
    myModuleModel : {
        myModelProp : 'myModelProp Property'
    }
}])
app.config.status = false; // refreshes app.config with next call
app.view([{
    name : 'myModuleView',
    el : '#myModuleView'
}])
app.module({
    route : 'my-module-route',
    name : 'myModule',
    model : myApp.model.myModuleModel,
    view : 'myModuleView',
    module : () =>{
        myApp.view.myModuleView.innerHTML = app.component.header('Hello World!');

        // do something
    }
})
*/
( function client() {
    const app = client.app ? client.app : {
        config : new Object, 
        component : appComponent,
        module : appModule,
        modules : new Array,
        model : appModel,
        models : new Array,
        view : appView,
        controller : appController,
        history : appHistory,
        type : withType
    }
    
    
    const getAppConfig = (() => {
        if(!app.config.status){
            fetch('config') // fetch config from server
            .then((res)=>{
                res.json().then((data)=>{
                    withType(data,Object,(data)=>{
                        for(const prop in data) app.config[prop] = data[prop];
                        appInit(); // 
                    })
                    app.config.status = true;
                    return data;
                });
            
            })
        }
    })(); // invoke getAppConfig
    function appInit() {
        withType(app.config,Object,(config)=>{
            app.models = config.models;
            app.modules = config.modules;
        });
    }
    // err
    function err(err){
        throw err
    }
    // withType
    function withType(args,type,callback){
        // assign callback to args type
        const argsType = typeof args;
        if(args.prototype != type) err(`withType called with type '${type}' but argsType is ${argsType} `);
            switch(args.prototype){
                case String:
                    callback(args)
                    break;
                case Array:
                    callback(args);
                    break;
                case Object:
                    callback(args);
                    break;
                case Function:
                    callback(args);
                    break;
                
                
            }
    }
    // appController
    /* 
    // assign function to controller.myController
        controller.set({ 
            myController : Function, 
            view : 'viewName', 
            model : 'modelName' 
        },()=>{
            // do something
        })
    // assign object to controller.myControllerLib
        controller.set({ 
            myControllerLib : Object, 
            view : 'viewName', 
            model : 'modelName' 
        },{
            myMethod : ()=> { // assign function to controller.myControllerLib.myMethod
                // do something
            }
        })
    */
    function appController(){
        const controller = new Object;
             
        
        controller.set = (args,callback) => {
            withType(args,String,(args)=>{
                // typeof args === 'string'
                return err(`controller.set('${args}') : args type is String`);
            })
            withType(args,Object,(args)=>{
                if(args.model && args.view){
                    const model = app.models[args.model],
                          $view = $(app.view[args.view]);
                    $view.is(':input') ? view.val(model[view.id]) : $view.html(model[view.id]);
                    if(args.event){
                        $view.on(args.event,(event)=>{
                            withType(callback,Function,()=>{
                                callback(event);
                            })
                        });
                    }
                }
                
             
                // property name of args object
                const argsProps = Object.getOwnPropertyNames(args);
                const argsKey = argsProps[0]; // get first property as key
                
                
                withType(args[argsKey],Function,()=>{ // assign method to contoller
                    controller[argsKey] = callback;
                })
                if(typeof args[argsKey] === "object"){
                    const argsKeyProps = Object.getOwnPropertyNames(args[argsKey]);
                    /* controller.set({ config : {

                    }})*/
                    if(argsKey === 'config'){

                    }
                }
            })
            
        }
        return controller
    }
    // appHistory
    function appHistory(args){

    }

    // appRouter
    /*
    client.router({
        '/route' : 'module'
    })
    */
    function appRouter(){
        withType(app.config.routes,Object,()=>{
            for(const appRoute in app.config.routes){
                const baseUrl = window.location.href.split('#')[0];
                window.location.replace(`${baseUrl}#${appRoute}`);
                getRoute(appRoute);
            }
        })
        const getRoute = (route)=>{
            withType(route,String,()=>{
                app.module[app.config.routes[route]]();
            })
        }
        
    }
    // appView
    function appView(args) {
        withType(args.model,Object,()=>{
            const modelProps = Object.getOwnPropertyNames(app.models[args.model]),
                  viewEls = new Array,
                  viewModel = new Array;
            for(const viewEl in document.querySelectorAll(args.el)){
                if(viewEl.id) app.view[args.name][viewEl.id] = viewEl;
                viewEls.push(viewEl);
            }
            if(modelProps[args.name]) viewModel[args.name] = app.models[args.model];
            return {
                els : viewEls,
                model : viewModel
            }
        });
    }
    // appUI
    /*
    client.UI({
        view : 'myView',

    })
    */
    function appUI(args){
        withType(args.view,String,()=>{
            const view = app.view[args.view],
                  component = app.component[args.component],
                  model = app.models[args.model],
                  controller = app.controller;
            
            
            
        });
    }
    // appModel
    function appModel(model){
        withType(model,Object,()=>{
            app.models[args.name] = model;
        });
    }
    // appModule
    function appModule(module){
        withType(module,Object,()=>{
            app.modules[Object.getOwnPropertyNames(module)[0]] = module;
        });
    }
    // appComponent
    function appComponent(component){
        withType(component,Object,()=>{
            app.component[Object.getOwnPropertyNames(component)[0]] = component;
            // TODO : populate with methods from components.js
        });
    }
    return {
        app : app,
        component : app.component,
        module : app.module,
        config : app.config,
        model : app.model,
        view : app.view,
        controller : app.controller,
        history : app.history,
        type : app.type,
        router : app.router
    }
})()
exports.default = client;
