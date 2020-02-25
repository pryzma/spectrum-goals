'use strict';
const utils = (()=>{

  // utils.date
  function date(format){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
  
    var yyyy = today.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
  
    //today =  `${yyyy}-${mm}-${dd}`;
    format = format ? format : 'mm-dd-yyyy';
    format = format.replace('dd',dd).replace('mm',mm).replace('yyyy',yyyy);
    return format;
  }
  // utils.time
  function time(){
    let today = new Date();
    let hh = today.getHours();
    hh = hh.toString().length === 1 ? `0${hh}` : hh;
    let mm = today.getMinutes();
    mm = mm.toString().length === 1 ? `${mm}0` : mm;

    return `${hh}:${mm}`;
  }
  // utils.datetime
  function datetime(){
      return `${date()} ${time()}`;
  }
  // utils.uid
  function uid(){  // generate unique id
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4();
  
  }
   // utils.uuidv4
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  return {
      date : date,
      time : time,
      datetime : datetime,
      uid : uid,
      uuidv4 : uuidv4
  };
})();
//exports.default = utils;
