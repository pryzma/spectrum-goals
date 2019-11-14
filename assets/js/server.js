/*
* assets/js/components.js
*/
const server = (() => {
    return {
        api : api
    }
})();

function api(args,callback){
    if(!args.method) args.method = 'get';
    if(axios){
        axios[args.method](args.url,args.data)
        .then((res) => {
            const data = [];
            for(let item of res.data){
                if(args.modify) item = args.modify(item);
                data.push(item);
            }
            if(callback) 
                return callback(data);
            if(args.callback) 
                return args.callback(data);
      
            return data;
        })
    }
  }
  export default server;