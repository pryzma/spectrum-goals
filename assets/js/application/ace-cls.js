class App {
    constructor(){
        this.Config = Object;
        this.Module = Object;
        
    }
    set config(){
        fetch('config')
        .then((data)=>{
            this.config = data;
            init();
        })
    }
   
}