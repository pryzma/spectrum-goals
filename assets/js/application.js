'use strict'

/**
* Application Client 0.12
* assets/js/application.js
* TODO:
* async position queue in initRequire to avoid load conflict
* replace application.object[getRoute().endpoint] with application.module() wherever appropiate
*/
//

const application = (function(){
  let debug,
      config, // configuration object -> initConfig
      object = {}, // application object -> initObj
      output, // private output object -> page
      position = 0, // private global position index -> initModules
      start,_start, // start timestamp object
      finish,_finish, // start timestamp object
      loadtime,_loadtime, // load time values
      loadModules; // modules array set values

//..............................................................................
//
/** @constructor
 * @description defaults properties are overwritten if defined in config/app.json
 * @param {string} template file default template assets/[templateEngine]/[template].[templateEngine]
 * @param {string} templateEngine template file folder & extension
 */
  const defaults = {
    template : 'pageLayout',
    templateEngine : 'html',
    templatePath : '{templateEngine}/templates/{template}.{templateEngine}', // template file path
    modulesPath : 'js/modules/{module}.js'
  }
//
  const require = (name,callback) => {
      const requireStart = new Date;
      $.get(`js/${name}.js`).done(() => {
        const requireEnd = new Date;
        const requireLoadtime = requireEnd - requireStart
        if(debug)debug(`application.require : js/${name}.js load complete in ${requireLoadtime} ms`)
        if(callback)callback()
      }).fail(()=>{
         throw `application.require : ${name} not available`
      });
  }

  const hash = () => location.hash.slice(1);
  const route = () => hash().split('/');
  const endpoint = () =>
    hash() ? getRoute().endpoint : config.default;

//..............................................................................

  const element = {}
  const elements = () => {
    const isElement = (obj,property) =>
      (typeof obj[property] === 'string')
      && obj[property].includes('#');
    const setElements = () => {
      for(let property in config)
        if(isElement(config,property)) element[property] = $(config[property]);
    }
    setElements(config)
    debug(`application.elements : ${Object.getOwnPropertyNames(element).join(',')}`);
    return element;
  }

//..............................................................................
//
/**
 * @description  adds (module) property to application object
 * @param {string} name
 */
const add = function(name,module,callback) {
   
    if(!typeof name==='string') throw 'application.add: module name was expected as string but is '+typeof name
    if(name.includes('.')){
      name = name.split('.');
      name[1] ? object[name[0]][name[1]] = module : object[name[0]] = module;
    }else{
      // call require if module object is undefined
      module ? object[name] = module : require(name);
    }
    if(module.route) {
      // add module to application routes object
      object.routes[module.route] = name;
    }else if (module) {
      // add given name to application routes object
      object.routes[name.replace('.','/')] = name;
    }
    if(typeof callback === 'function') callback()
    if(module) return module;

  }

//..............................................................................
// removes (module) property from application object
const remove = function(name) {

    const obj = {}
    for(let module in object)
      if(module != name ) obj[module] = module;
    object = obj;
  }
// call require for given (object.require) array
const initRequire = (_require,callback) => {
    if(_require.length>0){
      for(let item of _require) {

        require(item,()=>{
          if(application.requireCallback) {
            application.requireCallback();
            application.requireCallback = undefined;
          }

        });
      }
      if(callback)callback();
    }else{
      require(_require,callback)
    }
  }
//..............................................................................
//
const initModules = () => {
    require(`modules/${object.modules[position]}`, () =>{
      debug(`application.initModules : modules/${object.modules[position]} loaded`);
      if(position === object.modules.length-1){
        finish = new Date
        loadtime = finish - start
        application.loadtime = loadtime
        debug(`application.initModules complete in ${loadtime} ms: init load`);
        load(()=>{ // call moduleRouter
          // init load
          _finish = new Date;
          _loadtime =  _finish - _start;
          application.object[getRoute().endpoint].loadtime = _loadtime;
        })
        $(window).on( 'hashchange',()=>load(()=>{
          // event load

        }));

      } else {

        position++; // next position in modules array
        initModules();
      }
    });
  }
//..............................................................................
const initObj = (_application) => {
    if( _application && object ){ // checks if application object exists
      if(typeof _application === 'function'){
         _application()
      }else{
        for( let property in object){
          if(!object[property])
            object[property] = _application[property];
        }
      }

    } else if (_application) {
      object = _application; // use given object
    } else {
      // BUG:
      //object = application.object; // use existing object
    }
  }
//..............................................................................
const initConfig = (callback) => {
    // get config object from server
    $.get(`config`,(data) =>{
      config = data;
      object.config = config;
      object.default = config.default;
      object.modules = config.modules.map((module)=>module.module)
      object.routes = config.routes;
      //debug(`application.initConfig : json/config.json loaded`);
      //debug(config);
    }).done(() => {

    }).fail(() => {
      if(object.config){
        config = object.config; // get config object
      }else{
        // throw error if config object is not available
        throw 'initConfig : config not defined';
      }

    }).always(()=>{
      if(callback)callback()
    })
  }

//..............................................................................

const init = (( _application ) => { // initialize application
    start = new Date;

      initObj(_application); // assigns given, existing or merged application object
      initConfig(()=>{ // initialize config object
        require('application-debug',()=>{ // load debug
          debug = application.debug.log;
          debug(`application.init : ${config.name}`);
          if(config.modules) {
            loadModules = new Set(config.modules).values(); // SetIterator      
            if(config.require){
              initRequire(config.require,()=>{
                initModules(loadModules);
              })
            }else{
              initModules(loadModules);
            }
          }
          application.config = config;
        })

      });
      return object

  })()

//..............................................................................
const getRoute = (_route) => {

    _route = _route ? _route : hash()
    if(!_route) _route = endpoint() // get config.default if hash route not provided

    let _parameter,_endpoint;
    const routesProps = Object.getOwnPropertyNames(config.routes);
    for(let route of routesProps){
      if(_route===route){ // match route with config.routes properties
        _parameter = _route != route ? _route.replace(`${route}/`,'') : null;
        _endpoint = config.routes[route].split('.'); // _endpoint array for module route
        break;
      }
    }
    return {
      parameter : _parameter,
      endpoint : _endpoint
    }
  }
  //..............................................................................
  const moduleRouter = (_route) => {
    _start = new Date
    let callback
    if(typeof _route === 'function' ) {
      callback = _route;
      _route = getRoute();
    }
    if(!_route) _route = getRoute();
    const _endpoint = _route.endpoint;
    if(_endpoint){
      // module route

      const _module = _endpoint[1] ?
      object[_endpoint[0]][_endpoint[1]]
      : object[_endpoint[0]];
      if(endpoint[2]) _module = _endpoint[3] ?
      _module[_endpoint[2]][_endpoint[3]]
      : _module[_endpoint[2]].default;

      page(() => { // call page
        if(typeof _module.default === 'function'){
          _module.default(_route.parameter); // call module
        } else {
          // default property of module has to be a function
          throw `application.moduleRouter  : ${typeof module} ${module} is not a function`;
        }

        debug(`application.moduleRouter : #${hash()} > module:${_endpoint.join('.')}`);

      });
    }else{
      throw `application.moduleRouter : endpoint undefined`;
    }
    if(callback) callback();
  },
  load = moduleRouter
//..............................................................................
// displays page from template, execute callback and call render
const page = ( _module ) => {

    // view.main doesn't exist before first render
    // BUG:
    $(config.main).fadeOut(400,() => { // page transition out
      template( () => { // load template file
        debug(`application.page : ${config.main} #${template()}`);
        if(_module) _module(); // callback (module)
        render('page'); // render document
        view.main.fadeIn(()=>{
          view.main.trigger('application:module'); // module is ready
        }); // page transition in
      });
    });
    return output;
  },

//..............................................................................

  templates = {}
  const template = (_route, html, callback) => {
    // gets template for given or current route

    if(typeof _route === 'function' ) {
      callback = _route; // route argument as callback
      _route = getRoute().endpoint;
      html = true;
    }
    if(!_route) _route = getRoute().endpoint;
    if(!config.template) config.template = defaults.template;
    if(!config.templateEngine) config.templateEngine = defaults.templateEngine;
    let _template,_templateEngine,obj = _route[1] ? application.object[_route[0]][_route[1]] : application.object[_route];
    // BUG: config reference
    obj.template ? _template = obj.template : _template = config.template;
    obj.templateEngine ? _templateEngine = obj.templateEngine : _templateEngine = config.templateEngine;
    if(!templates[_template]){ // template is not available in templates object
      if(!config.templatePath) config.templatePath = defaults.templatePath; // get filepath
      let template_load_start = new Date;
      // TODO: mustache / handlebars /ejs
      $.get( `${_templateEngine}/templates/${_template}.${_templateEngine}`, function( data ) { // get file
        let template_load_end = new Date;
        let template_loadtime = template_load_end - template_load_start;
        debug(`application.template : ${_templateEngine}/templates/${_template}.${_templateEngine} load complete in ${template_loadtime} ms`);
        // ejs migrated to assets/js/ejs.js

        templates[_template] = data; // add to templates object
        // BUG:
        if(html) $(config.main).html(data); // view.main doesn't exist after first render

      }).done(() =>{ // callback in promise
        if(callback) callback();
      });
    }else{
      if(html) {
        _template = templates[_template]; // get template from templates object
        view.main.html(_template)
        if(callback) callback();
      }
    }


    return _template;
  }

//..............................................................................
// updates page view with module properties

const render = ( _this, callback ) => {
    let _route,_event = ''

    if(typeof _this === 'function' ) {
      callback = _this; // route argument as callback
      _route = getRoute().endpoint;
    }else if(_this) {
      _start = new Date
      if(_this.target){
        // event
        if(_this.target.id){
          _event = `(#${_this.target.id} ${_this.type} event)`
        }else if(_this.target.class){
          _event = `(.${_this.target.class} ${_this.type} event)`
        }
      }else{
        if(typeof _this === 'string') {
          _event = `(${_this})`
        }
      }
      _route = getRoute().endpoint;
    }
    if(!_route) _route = getRoute().endpoint;
    let _template = template(_route);

    let thisObj =  _route[1] ? application.object[_route[0]][_route[1]] : application.object[_route];
    $(`#${_template} h2`).html(thisObj.name);

    title(_route);
    elements();
      if(config.nav) nav();
      for(let property in object[_route]){
        if(typeof object[_route][property] === 'string' ){

          const selClassElement = $(`#${_template} .${property}`)
          if(selClassElement){
            selClassElement.html(str(object[_route][property])); // element html & parse with str
            if(selClassElement.length>0)
              debug(`application.render : updated ${selClassElement.length} elements with class .${property}`)
          }

          if($(`[data-property*='${property}']`)){
            $(`[data-property*='${property}']`).html(str(object[_route][property]));
          }

        }
      }
      //output = $(`#${template(_route)}`).html(str($(`#${template(_route)}`).html())); // parse with str
      output = $(`#${_template}`).html();
      if(callback) callback();
      for(let event in events) events[event]()
      _finish = new Date
      _loadtime =  _finish - _start
      thisObj.loadtime = _loadtime
      debug(`application.render ${_event}: ${_route} complete in ${_loadtime} ms`);
      //if(config.debug && application.debug) application.debug.debugger()
    //}
    return application;
  }

//..............................................................................
// creates/updates nav element
const nav = () => {


    const prefix = config.navMenuItemPrefix ?
    config.navMenuItemPrefix : '#';

    view.nav.html('');

    //for( let item of modules()){
    for(let item of config.menu){
        let menuItem = $('<li></li>').attr('id',item)
          .html(`<a href="${prefix}${item}">
                  ${str(object[ item ].name)}
                </a>`);
        view.nav.append(menuItem);


    }

    let _endpoint = getRoute().endpoint[0]
    let debugStr = modules().join(',').replace(_endpoint,`${_endpoint}(active)`)
    debug(`application.nav : ${debugStr}`);

    const active = `${config.nav} li#${_endpoint} a`;
    $( active ).addClass('active');
    if(config.style && object[_endpoint].color ) {
      $( active ).attr('style',`${str(config.style)}`);
    }
    return view.nav;
  }

//..............................................................................
// sets document title with name property of module object
const title = (route) => {

    if(!route) route = getRoute().endpoint;
    const obj = route[1] ? application.object[route[0]][route[1]] : application.object[route];
    let pageTitle = ( route === '') ? config.name : `${obj.name} - ${config.name}`;
    $('title').html(pageTitle);
    debug(`application.title : ${pageTitle}`);
    return pageTitle;
  }

//..............................................................................
/**
 * @description adds event to events object
 * @param {string} _element element to call event on
 * @param {string} _event event to call on element
 * @param {function} callback function to call on event
 * @param {string} callback module to call on event
 * @param {object} callback request to call on event
 */
const event = (_element, _event, callback ) => {
    //
    if(typeof _element === 'string')
      element[_element] ?
      _element = element[_element]
      : _element = $(_element);
    if(typeof callback === 'string'){

      let property = callback;
      let target = property.includes('.') ?
      object[property.split('.')[0]][property.split('.')[1]]
      : object[getRoute().endpoint][property];

      _element.val(target);
      callback = (event) => {
        property.includes('.') ?
        object[property.split('.')[0]][property.split('.')[1]] = event.target.value
        : module()[property] = event.target.value;
      }
    }else if (typeof callback === 'object') {
      const obj = callback
      callback = (event) => {
        if(obj.api){ // bind api request to event
          $.ajax(obj).done(()=>obj.callback());
        }
        if(event.target.class){
          const property = event.target.class;
          if(event.target.value) obj[property] = event.target.value;
        }
      }
    }
    let id
    if(_element){
      id = _element.attr('id');

      _element.on(_event,(event) => {
        _start = new Date;
        if (typeof callback === 'function')callback(event);
        render(event); // event render
      });
    }

    let _events = id ?  events[id] : events
    return _events
  },
  events = {}

//..............................................................................
/**
 * @description
 */
const  modules = function(){
    // get modules as array
    let _modules
    //if(config.modules){
    //  _modules = config.modules
    //} else {
      _modules = [];
      for(let property of Object.getOwnPropertyNames(application.object)){
        let obj = object[property];
        if(typeof obj.default === 'function' ) _modules.push(property)
      }
    //}
    return _modules;
  },
  //module = (route) => route ?  object[route] : object[getRoute().endpoint],
  moduleObj = (moduleRoute) => {
    let obj,route = getRoute(moduleRoute).endpoint;
    obj = route[1] ? object[route[0]][route[1]] : object[route];
    return obj;
  },
  module = moduleObj
//..............................................................................

const str = (str) => {
    // replace {template} strings with module properties
    const _endpoint = getRoute().endpoint[0];
    const obj = application.object[_endpoint];
    const objProps = Object.getOwnPropertyNames(obj)
    for(let item of objProps)
      if(typeof obj[item] === 'string' )
        str = str.replace(new RegExp(`{${item}}`, 'g'),obj[item]);
    const defaultProps = Object.getOwnPropertyNames(defaults)
    for(let property of defaultProps)
      str = str.replace(new RegExp(`{${property}}`, 'g'),defaults[property]);
      // TODO: template engines
   try{
     if(config.defaults) str = ejs.render(str);
   }catch(error){

   }

    return str
  },
  model = {},
  view = element,
  controller = (_element, _event, callback ) => {
    event(_element, _event, callback )
  }

  const methods = {
    route : route,
    endpoint : endpoint,
    object : object,
    model : model,
    modules : modules,
    module : module,
    config : config,
    require : require,
    requireCallback : undefined,
    /** Adds module to application object */
    add : add,
    remove : remove,
    init : init,
    load : load,
    event : event,
    controller : controller,
    render : render,
    page : page,
    nav : nav,
    element : element,
    view : view,
    template : template,
    templates : templates,
    title : title,
    debug : []
  }
  // return public methods & variables
  /** @namespace application */
  return methods
})();
