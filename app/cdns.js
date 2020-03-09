/*
* app/cdns.js
*/
'use strict';
function cdns(cdns){
    let output = {};
    output.js = '';
    output.css = '';
    const script = (src,sri) => `<script src="${src}" integrity="${sri}" crossorigin="anonymous"></script>`;
    const stylesheet = (src,sri) => `<link rel="stylesheet" href="${src}" integrity="${sri}" crossorigin="anonymous" />`;
    for(const cdn of cdns){
        if(cdn.type === 'script'){
            output.js +=script(cdn.url,cdn.sri); 
        }else if(cdn.type === 'stylesheet'){
            output.css +=stylesheet(cdn.url,cdn.sri);
        }
        //console.log('\x1b[96m',`[cdn]\x1b[0m \x1b[37m${cdn.url}\x1b[0m`)
    }
    
    return output;
}
module.exports = cdns;
