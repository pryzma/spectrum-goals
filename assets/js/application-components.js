
/*
* Application Client 0.12 Components
* assets/js/application-components.js
* TODO: 
*/
if(!component) const component = new Object;
const applicationComponents = () => {
    const components = [ // list components
        { component : 'alert' },
        { component : 'api' },
        { component : 'auth' },
        { component : 'btn' },
        { component : 'calendar' },
        { component : 'card' },
        { component : 'confirm' },
        { component : 'date' },
        { component : 'editor' },
        { component : 'formData' },
        { component : 'formPost' },
        { component : 'modal' },
        { component : 'navTabs' },
        { component : 'repeat' },
        { component : 'time' },
        { component : 'type' },
        { component : 'uid' }
    ]
    for(const componentObj in components)
        loadComponent(componentObj)
    
    function loadComponent(args){
        // fetch component & attach to component object
        const fetchComponent = fetch(`js/components/${args.component}`);
        component[args.component] = () => fetchComponent;
    }
}