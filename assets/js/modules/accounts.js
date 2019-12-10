/* jshint esversion: 6 */
 /** accounts module object */
const accounts = {
  name : 'Accounts',
  default : accountsOverview,
  template : 'accounts'
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
  $.get('html/templates/accounts.html', (data) => {
    $(application.config.main).html(data);
    $('#newAccount').on('click', () => {
      newAccount();
    });
  });
  /** Table component object */
  const medientListTable = {
    el : '#medientList',
    model : 'Account',
    class : 'table-striped table-hover',
    cols : medientListTableLabels,
    data : medientsData,
    methods: {
      onRowClick : (event) => {
        account(event.target.parentElement.id, "medient");
      }
    }
  };

  const teamListTable = {
    el : '#teamList',
    model : 'Account',
    class : 'table-striped table-hover',
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

  $('.breadcrumb-item').removeClass('active');
  $('#accountBreadCrumb').remove();

  const accountBreadCrumb = $('<li></li>')
    .attr('class','breadcrumb-item active')
    .attr('id','accountBreadCrumb')
    .html(account[0].name);
  
  $('.breadcrumb').append(accountBreadCrumb);
  
  accountsElement.data( 'account' , account );
  $.get('html/templates/accountDashboard.html', (data) => {
    accountsMainElement.html(data);
    accountDelete(id);
    accountPersonalInfo(account);
  });
}
/**
 *
 * @param {string} id
 */
function accountDelete(id){

  $('#accountDeleteBtn').on('click',()=>{


      component.api({
        method : 'delete',
        url : 'api/accounts/'+id,
        callback : () => {
          component.alert({ class : 'danger', message : '<i class="fas fa-times"></i> Account verwijderd' });
          accountsOverview();
        }
      });

  });

}
// ........................................
/**
 * gets personal info for selected medient
 * @param {object} account
 */
function accountPersonalInfo(account) {

  $('#accountInfoEdit').html()
  $('#accountName').html(account[0].name)
  $('.breadcrumb-item.name').html('<a href="#accounts">Accounts</a>').on('click',()=>{
    console.log('test')
    accountsOverview()
 
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
    accountsOverview();
  });
}

function newAccount() {
  $.get('html/templates/newAccount.html', (data) => {
    $('#accountsMain').html(data);
    $('#accountEditCancelBtn').on('click', () => {
      accountsOverview();
    });
    $('#accountBreadCrumb').remove();

    const accountBreadCrumb = $('<li></li>')
      .attr('class','breadcrumb-item active')
      .attr('id','accountBreadCrumb')
      .html("New Account");
    $('.breadcrumb').append(accountBreadCrumb);

    $('#accountSaveBtn').on('click', () => {
      const accountFormData = component.form.data({ el : 'form#accountInfo', model : 'Account'});
      component.api({
        method : 'post',
        url : 'api/accounts',
        data : accountFormData,
        callback : (data) => {
          accountsOverview();
        }
      });
    });
  });
}

application.add('accounts', accounts);
