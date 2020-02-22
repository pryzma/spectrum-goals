/* jshint esversion: 9 */
 /** accounts module object */
const accounts = {
  name : 'Accounts',
  default : accountsOverview,
  template : 'accounts',
  view : {
    default : account
  },
  data : [],
  medientList : { data : [] },
  teamList : { data : [] },
  modify : (account) => {

    const accountAdd = {
      name : account.firstName + ' ' +  account.lastName,
      test : account.indication.split('T')[0]
    };
    
    if(account.profile === 'medient') {
      account.indication = account.indication.split('T')[0]
    }
    return { ...account, ...accountAdd };
  },
  accountsData : {
    url : 'api/accounts',
    callback : (data) => accounts.data = data
  },
  medientsData : {
    url : 'api/accounts/medients',
    modify : medientDataModify,
    callback : (data) => accounts.medientList.data = data
  },
  teamData : {
    url : 'api/accounts/teammembers',
    modify : medientDataModify,
    callback : (data) => accounts.teamList.data = data
  }

};




const accountDataModify = accounts.modify;

 /** API data component object */
const medientsData = accounts.medientsData;

const medientListTableLabels = {
  name : { label : 'Naam' },
  username : { label : 'Gebruikersnaam' },
  email : { label : 'E-Mail'}
};

const teamData = accounts.teamData;

const teamListTableLabels = {
  name : { label : 'Naam' },
  username : { label : 'Gebruikersnaam' },
  email : { label : 'E-Mail'}
};

/** Overview of accounts */
function accountsOverview(callback) {
  $('#amModal').modal('hide')
  $.get('html/templates/accounts.html', (data) => {
    $(application.config.main).html(data);
    $('#newAccount').on('click', () => {
      newAccount();
    });
    if(callback) callback();
    $('#search').on('input', () => {
      let value = $('#search').val();
      let arr = $('tbody tr');
      let filter = new RegExp(value, 'i');
      for (let i = 0; arr.length > i; i++) {
        if (filter.test(arr[i].textContent)) {
          arr[i].style.display = "table-row";
        } else {
          arr[i].style.display = "none";
        }
      }
    });
  });
  /** Table components */
  component.table({
    el : '#accountsMedients',
    model : 'Account',
    class : 'table-striped green table-hover',
    cols : medientListTableLabels,
    data : medientsData,
    methods: {
      onRowClick : (event) => {
        account(event.target.parentElement.id, "medient");
      }
    }
  });

  component.table({
    el : '#accountsTeammembers',
    model : 'Account',
    class : 'table-striped green table-hover',
    cols : teamListTableLabels,
    data : teamData,
    methods: {
      onRowClick : (event) => {
        account(event.target.parentElement.id, "team");
      }
    }
  });


}

// ........................................
/**
 * loads account for selected medient
 * @param {string} id
 */
function account(id, type) {
  const accountsElement = $('#accounts'),
        accountsMainElement = $('#accountsMain'),
        accountsMainHtml = accountsMainElement.html();
  let account;
  if (type === "medient") {
    account = accounts.medientList.data.filter((account) => account.id === id);
  } else {
    account = accounts.teamList.data.filter((account) => account.id === id);
  }

  
 
  
  accountsElement.data( 'account' , account[0] );
  $.get('html/templates/accountDashboard.html', (accountDashboard) => {

    //location.hash = '#'+account[0].id
    component.modal({
      title : '<i class="fas fa-profile"></i> Account <b>'+account[0].name+'</b>',
      body : accountDashboard,
      open : ()=>{
        if(account[0].profile === 'teammember'){
          $('#formGroupMedientIndication').remove()
        }else{
          
          
        }
        $('#accountCancelBtn').on('click',()=>{
          $('#amModal').modal('hide')
        })
        $('#accountDeleteBtn').on('click',()=>accountDelete(id));
        accountPersonalInfo(account);
      },
      close : ()=>{
        //location.hash = '#accounts'
      }
    })
   
  });
}
/**
 *
 * @param {string} id
 */
function accountDelete(id){

  


      component.api({
        method : 'delete',
        url : 'api/accounts/'+id,
        callback : () => {
          
          accountsOverview(()=>{
            component.alert({ class : 'danger', message : '<i class="fas fa-times"></i> Account verwijderd' });
          });
          
        }
      });

 

}
// ........................................
/**
 * gets personal info for selected medient
 * @param {object} account
 */
function accountPersonalInfo(account) {

  $('#accountInfoEdit').html();
  $('#accountName').html(account[0].name);
  $('.breadcrumb-item.name').html('<a href="#accounts">Accounts</a>').on('click',()=>{
    accountsOverview();
 
  });
  let indication = account[0].indication
  const indicationInput =  $('input#indication')
  Object.keys(account[0]).map((key, index) => $(`input#${key}`).val(account[0][key]));
  if(indication){
      const indicationDateFormat = indication
      .split('T')[0]
      .split('-')[2]+'-'+indication.split('-')[1]+'-'+indication.split('-')[0]
      console.log(indicationDateFormat)
      indicationInput.val(indicationDateFormat)
      $('input#indication').val(indicationDateFormat)
      indicationInput.datepicker({
        startDate :  new Date(),
        autoclose : true,
        format: 'dd-mm-yyyy',
        language : 'nl'
      }).on('show',(e)=>{
        $('.datepicker').addClass('shadow-lg').attr('style',$('.datepicker').attr('style').replace('top: 91px;','top: 171px !important;'))
      });
  }else{

  }
 
 
  
  
  
  //$('input#indication').remove()
  
  
  $('#accountSaveBtn').on('click', () => {
   // const accountFormData = component.form.data({ el : 'form#accountInfoEdit', model : 'Account'});
    const accountFormData = component.form.fields({ el : 'form#accountInfoEdit', model : 'Account'});
    component.api({
      method : 'put',
      url : 'api/accounts',
      data : accountFormData,
      callback : (data) => {
        accountsOverview();
      }
    });
  });
  $('#accountEditCancelBtn').on('click', () => {
    $('#amModal').modal('hide')
    accountsOverview();
  });
}

function newAccount() {
  $.get('html/templates/newAccount.html', (newAccount) => {
    location.hash = '#accounts/add'
    //$('#accountsMain').html(data);
    component.modal({
      title : '<i class="fas fa-user-plus"></i> Account Aanmaken',
      body : newAccount,
      open : ()=>{
        $('form#accountInfo').disableAutoFill();
        $('#accountEditCancelBtn').on('click', ()=>$('#amModal').modal('hide'));
        const formGroupMedientIndication = $('#formGroupMedientIndication');
        $('input#indication').attr('autocomplete','off').datepicker({
          startDate :  new Date(),
          format: 'dd-mm-yyyy',
          autoclose : true,
          language : 'nl'
        }).on('show',(e)=>{
          $('.datepicker').addClass('shadow-lg')
          
        })
        if($('#accountsTeammembersTab').hasClass('active')){
          $('#profileSelect').val('teammember');
          $('#profile').val('teammember');
          formGroupMedientIndication.remove()
        }else{

        }
        $('#profileSelect').on('change',(e)=>{

          const selectVal = e.target.value;
          $('#profile').val(selectVal);

          if(selectVal === 'teammember'){
            formGroupMedientIndication.remove()
          }else{
            
            //$('form#accountInfo').append(formGroupMedientIndication);
            $('#formGroupEmail').after(formGroupMedientIndication)
            $('input#indication').attr('autocomplete','off').datepicker({
              startDate :  new Date(),
              format: 'dd-mm-yyyy',
              autoclose : true,
              language : 'nl'
            })
          }
          //console.log(selectVal);
          $('#profile').val(selectVal);
          $('input[name=profile]').val(selectVal);

        });
        //$('#accountSaveBtn').on('click', saveAccount);
        $('#accountInfo').on('submit',(e)=>{
          $('#accountValidation').html('')
          $('form#accountInfo input').removeClass('is-invalid')
          e.preventDefault();
          component.api({
            url : 'api/accounts',
            callback : (accounts)=>{
              const accountFormData = component.form.fields({ el : 'form#accountInfo', model : 'Account'}),
                    accountExistsMsg = [];
              
              accounts.map((account)=>{
                if(accountFormData.username === account.username) accountExistsMsg.push({field : 'username',msg : `Gebruikersnaam <b>${accountFormData.username}</b> is al in gebruik`});
                if(accountFormData.email === account.email) accountExistsMsg.push({field : 'email',msg : `E-mail adres <b>${accountFormData.email}</b> is al in gebruik voor account <b>${account.username}</b>`});
              });
              console.log(accountExistsMsg)
              if(accountExistsMsg.length > 0){
                accountExistsMsg.map((item)=>{
                  $('#accountValidation').append('<p><i class="fas fa-exclamation"></i> '+item.msg+'</p>');
                  $('form#accountInfo input#'+item.field).addClass('is-invalid')
                })
              }else{
                saveAccount()
              }
              
            }
          })
        })

      }
    });
    
  });
}

function saveAccount(){
  
  const accountFormData = component.form.fields({ el : 'form#accountInfo', model : 'Account'})
  let validated = true
  $('#accountInfo input').removeClass('invalid')
  for(const property in accountFormData){
    const input = $('#'+property)
    
    if(input.val()==='' && input.attr('required')){
      input.addClass('invalid');
      validated = false
    }
  }
  if(validated){
    
    component.api({
      method : 'post',
      url : 'api/accounts',
      data : accountFormData,
      callback : (data) => {
        setTimeout(()=>{
          component.alert({message : '<i class="fas fa-user-plus"></i> Account <b>'+ accountFormData.firstName + ' ' + accountFormData.lastName + '</b> is aangemaakt'});
        },600);
        
        accountsOverview();
      }
    });
  }
  
   
   
}


application.add('accounts', accounts);
