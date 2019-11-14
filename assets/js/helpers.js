/*
* assets/js/helpers.js
*/
const helper = (() => {
  return { 
    form : { 
      post : (args,callback) => formPost(args,callback),
      fromModel : (args) => formFromModel(args),
      input : {
        datepicker : (args) => formInputDatepicker(args)         
      } 
    },
    table : (before,args,callback) => {
      if(typeof before === 'object'){
        if(typeof args === 'function'){
          callback = args;
        }
        args = before;
      }
      if(typeof before === 'function')before();
      new Vue(args);
      if(callback)callback();
    },
    modal : (args) => modal(args),
    alert : (args) => alert(args),
    api : api,
    date : date
  }
})() // invoke
// helper.date
function date(){
  let today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  today =  `${yyyy}-${mm}-${dd}`;
  return today;
}
// helper.api
/*
helper.api({
  url : 'api/endpoint',
  method : 'get',
  modify : (item) => {
    // do something with returned data item
  },
  callback : (data) => {
    // do something with returned data
  }
})
*/
function api(args,callback){
  if(!args.method) args.method = 'get';
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
// helper.modal
/*
helper.modal({
  title : 'Title of modal',
  body : 'Body of modal',
  close : () => {
    // do something on close
  },
  save : () => {
    // do something on save (primary button is clicked)
  },
  buttons : [
    { html : 'Button text', onClick : () => {
      // do something on button click
    }}
  ]
})
*/
function modal(args){
  const $amModal = $('#amModal').modal();
  $('#amModalTitle').html(args.title);
  $('#amModalBody').html(args.body);  
  
  if(typeof args.save === 'function'){
    $('#amModalSave').on('click',()=>{
      args.save();
    });
  }
  console.log(args)

  if(args.buttons){
    const button_container = document.createElement('div');
    button_container.setAttribute('id','button_container')
    const footer = document.getElementById('amModalFooter');
    for(let button of args.buttons){
      
      
      const button_ = document.createElement('button');
      button_.setAttribute( 'class', `btn btn-${button.class}`)
      button_.innerHTML = button.html;
      if(typeof button.onClick === 'function' ){
        button_.addEventListener('click', (event)=>{
          button.onClick(event);
        })
        
      }
      button_container.appendChild(button_)
      
    }
    footer.appendChild(button_container)
  }
  
  $amModal.on('hidden.bs.modal', function (e) {
    $('#amModalTitle').html('');
    $('#amModalBody').html('');
    $('#button_container').remove();
    if(typeof args.close === 'function') args.close();
  });
  
}
// table
/*
helper.table({
  model : 'modelName',
  data : {
    url : 'api/endpoint',
    modify : (item) => {
      // modify fetched data
    }
  },
  cols : {
    propNameOne : {
      label : 'Label of propNameOne'
    },
    propNameTwo : {
      label : 'Label of propNameTwo'
    },
  }
})
*/
function table(args){
  let table = document.createElement('table');
  table.setAttribute('class',`table ${args.class}`);
  const thead = document.createElement('thead'),
        models = application.config.models,
        model = models[args.model],
        props = Object.getOwnPropertyNames(model);
  let tr,th;
  for(let col in args.cols){
    //if(args.cols[prop]){
      tr = document.createElement('tr');
      th = document.createElement('th');
      th.innerHTML = args.cols[col].label;
      tr.appendChild(th);
   // }
  }
  thead.appendChild(tr);
  table.appendChild(thead);
  
  if(args.data.url){
    const apiObj = {
      url : args.data.url,
      callback : (data) => {
        table = tableBody(table,Object.getOwnPropertyNames(data[0]),data,args);
        tableInsert(args,table);
        if(args.data.callback) args.data.callback(data);
      }
    }
    if(args.data.modify) apiObj.modify = args.data.modify;
    return api(apiObj,()=> table );
  }else{
    table = tableBody(table,props,args.data);
    tableInsert(args,table);
  }
  
  // table body
  function tableBody(table,props,data,args){
    const tbody = document.createElement('tbody');
    let tr,td;
    for(let item of data){
      tr = document.createElement('tr');
      if(item.id) tr.setAttribute('id',item.id);
      if(args.onRowClick) {
        tr.addEventListener('click', (event)=>{
          args.onRowClick(event);
        });
      }
      for(let prop of props){
        td = document.createElement('td');
        td.innerHTML = item[prop];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  // table insert
  function tableInsert(args,table){
    if(!args.insert) args.insert = 'html';
    if(!args.el) args.el = application.config.main;
    $(args.el)[args.insert](table);
    return table;
  }
}


// form
function formData(form){
  
  const formData = new FormData(form),formObj = {};
 
  for(let [key,value] of formData.entries())
    formObj[key] = value;
  
  return formObj
}
// helper.form.post
/*
helper.form.post({
  url : 'api/endpoint',
  el : 'myFormId'
},(data) => {
  // do something after axios.post has finished
})
*/
function formPost(args,callback){
  const form = document.getElementById(args.el);
  let formObj;
  form.addEventListener( 'submit', ( event ) => {
    formObj = formData(form);
    event.preventDefault();
    axios.post(args.url,formObj)
    .then((formObj) => {
      callback(formObj)
    }).catch(function(error){
      $(args.el).html(`A error has occured : ${error}`);
    });
  });
}
/*
helper.form.fromModel({
  model : 'modelName',
  fields : {
    propNameOne : {
      label : 'Label Of PropNameOne',
    }
  }
  onSubmit : (event) => {
    // do something on submit
  }
})
*/
// create form with model
function formFromModel(args){
  const models = application.config.models,
        form = document.createElement('form'),
        formBtnSave = document.createElement('button');
        formBtnSave.setAttribute('class','btn btn-primary btn-lg');
        formBtnSave.innerHTML = args.btnSaveTxt;
        form.setAttribute('encType','multipart/form-data')
        let model,props;
        if(typeof args.model==='string'){
          props = Object.getOwnPropertyNames(models[args.model])
        }else if(args.model.constructor === Array ){
          props = []
          for(let item of args.model){
            for(let prop of Object.getOwnPropertyNames(models[item]))
              props.push(prop)
          }
        }
  for(let prop in args.fields){
    if(props.includes(prop)){ // given property matches property in model(s)
      // append row to form
      form.appendChild(formRow(prop,args));
    }else{
      console.log(prop)
      if(prop.split('_')[0] === 'header'){
        const header = document.createElement(prop.split('_')[1])
        header.innerHTML = args.fields[prop]
        form.appendChild(header)
      }
    }
  }
  if(!args.insert) args.insert = 'append'
  if(!args.el) args.el = application.config.main
  $(args.el)[args.insert](form);
  // submit event
  form.appendChild(formBtnSave);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = formData(form);
    if(args.url){
      if(!args.method) args.method = 'post'
      if(args.method){
        if(args.before){
          //axios.interceptors.request.use((data) => {
            args.before(data)
          //});
        }

        axios[args.method](args.url,data)
        .then((data) => {
          if(args.onSubmit)args.onSubmit(data)
        })
      }
    }else {
      if(args.onSubmit) args.onSubmit();
    } 
  });
  return form
  // form group row
  function formRow(prop,args){
    // row
    const formRow = document.createElement('div');
    formRow.setAttribute('class','form-group row');
    // label
    const formRowLabel  = document.createElement('label');
    formRowLabel.setAttribute('for',prop);
    formRowLabel.setAttribute('class','col-sm-2 col-form-label')
    formRowLabel.innerHTML = args.fields[prop].label;
    formRow.appendChild(formRowLabel);
    const formInputCol = document.createElement('div');
    formInputCol.setAttribute('class','col-sm-10');
    if(args.fields[prop].use){
      formInputCol.appendChild(args.fields[prop].use())
    }else{
      // input
      const formRowInput = document.createElement('input');
      if(args.fields[prop].type){
        formRowInput.setAttribute('type',args.fields[prop].type);
        
      }
      formRowInput.setAttribute('class','form-control');
      formRowInput.setAttribute('id',prop);
      formRowInput.setAttribute('name',prop);
      if(args.fields[prop].value){
        formRowInput.setAttribute('value',args.fields[prop].value)
      }
      formInputCol.appendChild(formRowInput)
      if(args.fields[prop].type === 'date') {
        $(`#${prop}`).datepicker();
        console.log(prop)
      }
    }
    
    formRow.appendChild(formInputCol);
    return formRow;
  }
}

// custom form inputs
function formInputDatepicker(args){

}

function formInputTimepicker(args){
  
}

// alert 
function alert(args){

}