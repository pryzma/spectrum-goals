/*
* app/render.js
*/
'use strict';
module.exports = (res,view,render) => {
    res.render(view,render);
    console.log('\x1b[96m',`[render]\x1b[0m \x1b[37mviews/${view}.ejs\x1b[0m`);
};
