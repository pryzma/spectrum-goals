'use strict';

/*
* Application Client 0.12 Debugger
* assets/js/application-debugger.js
* TODO: 
*/

const debug = (function(){
    let DebuggerTemplateFile;
    const module = application.module(),
    getDebuggerTemplateFile = (callback) => {
        $.get('html/debug/debugger.html',(data,callback)=>{
            DebuggerTemplateFile = data;
            //if(callback)callback();
        }).done(callback);
    },
    DebuggerTemplate = ()=> DebuggerTemplateFile ?  DebuggerTemplateFile : getDebuggerTemplateFile(()=> DebuggerTemplateFile),
    DebuggerStats = () =>{
        const statsElement = $('#debugStats');
        statsElement.html(`<small><i class="fas fa-history"></i> Init load time : <span style="color:${loadTimeColor(application.loadtime)}">${application.loadtime} ms</span>; ${module.name} was loaded in<span style="color:${loadTimeColor(module.loadtime)}"> ${module.loadtime} ms</span></small>`);
            
    },
    DebugLog = [],
    DebuggerLog = (log) => {
        if(log){
            const configDebug = application.object.config.debug;
            if(typeof configDebug === 'boolean'){
                if(configDebug)console.log(log);
            //}else if(configDebug.length){ // filter array
            }else if( configDebug.constructor === Array){
                //console.log('array')
                for(let item in configDebug){
                    
                    if(log.indexOf(configDebug[item])>=0){
                        console.log(log);
                    }
                }
            }else{
                if(log.indexOf(configDebug)>=0){
                    console.log(log);
                }
            }
            
            
            DebugLog.push(log);
        }else{
            const DebuggerLogElement = $('#debugLog');
            for(let item of DebugLog){
                if(item.includes(' ms')){
                    let loadtime = (item.split('in ')[1].split(' ms')[0]);
                    item = item.replace(`${loadtime} ms`,`<span style="color:${loadTimeColor(loadtime/1)}">${loadtime} ms</span>`);
                }else if (item.includes('Error')) {
                    item = `<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> ${item}</span>`;
                }
                item = item.replace('complete','<i class="fas fa-check"></i><b>complete</b>');
                DebuggerLogElement.append(`<div>${item}</div>`);
            }
        }
    },
    DebuggerModulePropertiesTable = () =>{
        const DebuggerModulePropertiesTableElement = $('#debugModuleProps table tbody');
        DebuggerModulePropertiesTableElement.html('');
        for(let item in module){
            if(item!='default'){
                if(item === 'color'){
                  $('#properties table tbody').append(`<tr><td><code>${item}</code></td><td class="Inconsolata" style="background:${application.object[application.endpoint()][item]};color:#fff;">${application.object[application.endpoint()][item]}</td></tr>`);
                }else if (item === 'loadtime') {
                  $('#properties table tbody').append(`<tr><td><code>${item}</code></td><td class="Inconsolata" style="color:${loadTimeColor(application.object[application.endpoint()][item]/1)}">${application.object[application.endpoint()][item]} ms</td></tr>`);
          
                }else{
                  $('#properties table tbody').append(`<tr><td><code>${item}</code></td><td class="Inconsolata">${application.object[application.endpoint()][item]}</td></tr>`);
                }
            }
        }
        
    },
    DebuggerConfigPropertiesTable = () => {
        const DebuggerConfigPropertiesTableElement = $('#debugConfigProps table tbody');
        for(let item in application.object.config)
            DebuggerConfigPropertiesTableElement.append(`<tr><td><code>${item}</code></td><td class="Inconsolata">${application.object.config[item]}</td></tr>`);
    },
    DebuggerSwitch = () => {
        application.controller($('.debugswitch'),'click',function(){
            if(application.object.config.debug){
              application.object.config.debug =false;
              $('#debugger').fadeOut();
              console.clear();
            }else{
              application.object.config.debug =true;
            }
        });
    },
    Debugger = function(){
        const targetElement = $('#debugger');
        const template = DebuggerTemplate;
        if(targetElement){
            targetElement.html(template);
            DebuggerStats();
            DebuggerLog();
            DebuggerModulePropertiesTable();
            DebuggerConfigPropertiesTable();
            DebuggerSwitch();
        }else{
            console.warn('application.debug : no target element for output');
        }

    };
    const loadTimeColor = (time) => {
        let color;
        if(time<500){
          color = 'LimeGreen';
        }else if (time<1000) {
          color = 'Goldenrod';
        }else if (time<1500) {
          color = 'OrangeRed';
        }else{
          color = 'red';
        }
        return color;
    };
    return {
        debugger : Debugger,
        log : DebuggerLog
    };
    
})();
application.debug = debug;
