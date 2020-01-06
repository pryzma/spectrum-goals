/* jshint esversion: 9 */
 /** accounts module object */
const accounts = {
  name : 'Accounts',
  default : accountsOverview,
  template : 'accounts',
  view : {
    default : account
  }
};

const medientList = { data : [] };
const teamList = { data : [] };

const accountDataModify = (account) => {
  const accountAdd = {
    name : account.firstName + ' ' +  account.lastName
  };
  return { ...account, ...accountAdd };
};

 /** API data component object */
const medientsData = {
  url : 'api/accounts/medients',
  modify : medientDataModify,
  callback : (data) => medientList.data = data
};

const medientListTableLabels = {
  name : { label : 'Naam' },
  username : { label : 'Gebruikersnaam' },
  email : { label : 'E-Mail'}
};

const teamData = {
  url : 'api/accounts/teammembers',
  modify : medientDataModify,
  callback : (data) => teamList.data = data
};

const teamListTableLabels = {
  name : { label : 'Naam' },
  username : { label : 'Gebruikersnaam' },
  email : { label : 'E-Mail'}
};

/** Overview of accounts */
function accountsOverview() {
  $('#amModal').modal('hide')
  $.get('html/templates/accounts.html', (data) => {
    $(application.config.main).html(data);
    $('#newAccount').on('click', () => {
      newAccount();
    });
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
  /** Table component object */
  const medientListTable = {
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
  };

  const teamListTable = {
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
  };

  component.table(medientListTable);
  component.table(teamListTable);
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
    account = medientList.data.filter((account) => account.id === id);
  } else {
    account = teamList.data.filter((account) => account.id === id);
  }


 
  
  accountsElement.data( 'account' , account[0] );
  $.get('html/templates/accountDashboard.html', (accountDashboard) => {
    location.hash = '#'+account[0].id
    component.modal({
      title : '<i class="fas fa-profile"></i> Account '+account[0].name,
      body : accountDashboard,
      open : ()=>{
        $('#accountDeleteBtn').on('click',()=>accountDelete(id));
        accountPersonalInfo(account);
      },
      close : ()=>{
        location.hash = '#accounts'
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
          component.alert({ class : 'danger', message : '<i class="fas fa-times"></i> Account verwijderd' });
          accountsOverview();
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
    console.log('test');
    accountsOverview();
 
  });

  Object.keys(account[0]).map((key, index) => $(`input#${key}`).val(account[0][key]));
  $('#accountSaveBtn').on('click', () => {
    const accountFormData = component.form.data({ el : 'form#accountInfoEdit', model : 'Account'});
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
        $('#accountEditCancelBtn').on('click', ()=>$('#amModal').modal('hide'));
        $('#profileSelect').on('change',(e)=>{
          const selectVal = e.target.value;
          console.log(selectVal);
          $('#profile').val(selectVal);
          $('input[name=profile]').val(selectVal);
        });
        $('#accountSaveBtn').on('click', saveAccount);
      }
    });
    
  });
}

function saveAccount(){
  const accountFormData = component.form.fields({ el : 'form#accountInfo', model : 'Account'});
   console.log(accountFormData);
  
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


application.add('accounts', accounts);
