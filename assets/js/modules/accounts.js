 /** accounts module object */
const accounts = {
  name : 'Accounts',
  default : accountsOverview,
  template : 'accounts'
};

const accountList = { data : [] };

const accountDataModify = (account) => {
  const accountAdd = {
    name : account.firstName + ' ' +  account.lastName
  };
  return { ...account, ...accountAdd };
};

 /** API data component object */
const accountsData = {
  url : 'api/accounts',
  modify : accountDataModify,
  callback : (data) => accountList.data = data
};

const accountListTableLabels = {
  name : { label : 'Naam' },
  username : { label : 'Gebruikersnaam' },
  email : { label : 'E-Mail'}
};

/** Overview of accounts */
function accountsOverview() {
  /** Table component object */
  const accountsListTable = {
    el : '#accountsList',
    model : 'Account',
    class : 'table-striped table-hover',
    cols : accountListTableLabels,
    data : accountsData
  };
  return component.table(accountsListTable);
}

application.add('accounts', accounts);
