/*
* app/utils.js
*/
module.exports = {
    fromData : (data,dest,vals) => {
        for(let val of vals){
            dest[val] = data[val];
            delete data[val];
        }
        return [data,dest]
    }
}