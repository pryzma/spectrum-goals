/*
* assets/js/dom.js
*/
const DOM = ((args)=>{
  // element
  /*
DOM.element(['div',{id : 'myDiv'},'content of myDiv']);
DOM.element(['table',{id : 'myTable',class : 'table'},
    ['thead',
        ['tr',['th','Header#1'],['th','Header#2'],['th','Header#3']]
    ],
    ['tbody',
        ['tr',['td','Column#1'],['td','Column#2'],['td','Column#3']]
    ]
]);
*/
  function element( args, callback ){
    const isArray = ( arr ) => Array.isArray(arr);
    if ( !isArray( args ) ) 
      return element.call( this, Array.prototype.slice.call( arguments ) )
    let name = args[0],
        attributes = args[1],
        element = document.createElement( name ),
        start = 1;
    if(attributes.id){
      
    }
    if ( typeof attributes === 'object' && attributes !== null && !isArray( attributes ) ) {
      for ( let attribute in attributes ) 
        element.setAttribute( attribute ,attributes[ attribute ] )
      start = 2
    }
    for ( let index = start; index < tag.length; index++ ) {
      if( isArray( tag[ index ] ) ){
        element.appendChild(DOM.create( tag[ index ] ) )
      } else {
        element.appendChild( document.createTextNode( tag[ index ] ) )
      }
    }
    if( callback ) callback()
    return element
  }
  return {
    element : element
  }
})();
