/*
* app/render.js
*/
const render = (res,view,render) => {
    res.render(view,render);
    console.log('\x1b[96m',`[render]\x1b[0m \x1b[37mviews/${view}.ejs\x1b[0m`)
}
module.exports = render;