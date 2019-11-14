'use strict'

/*
* Application Client 0.12 Backbone.js integration
* assets/js/application-backbone.js
* TODO: 
*/
const backbone = (function(){ // Backbone mediator
  if(Backbone){
      return {
          // view
          view : backboneView,
          // model
          model : backboneModel,
          // collection
          collection : backboneCollection
      }
  }else{
      console.warn('application-backbone : Backbone is not available')
  }
})()
application.backbone = backbone;
// View
function backboneView(obj){
  const module = application.module(); // get module object
  if(!obj) obj = {} // create empty object if not given
  /* view : {
    el :
    template :
    render :
  } */
  if(module.view && typeof module.view === 'object'){ // module has view object property
      for(let prop in module.view){
          // get module view object properties & merge with given or created object
          if(!obj[prop]) obj[prop] = module.view[prop] 
      }
  }else{
    // module has no view object property or is not a object
    if(!module.view) console.warn('application.backbone.view : view property of module not defined')
    return;
  }
  // get el property from object or get from application config
  const el = obj.el ? obj.el : application.config.main;
  // create Backbone View instance
  const View = Backbone.View.extend({
      el: el,
      template: _.template(obj.template), // get template property from module object
      initialize: function(){
          this.render();
      },
      render: obj.render // get render property from module object
  });
  return View
}
// Model
function backboneModel(obj){

}
// Collection
function backboneCollection(obj){

}
