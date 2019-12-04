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
  /** Table component object */
  const medientListTable = {
    el : '#medientList',
    model : 'Account',
    class : 'table-striped table-hover',
    cols : medientListTableLabels,
    data : medientsData
  };

  const teamListTable = {
    el : '#teamList',
    model : 'Account',
    class : 'table-striped table-hover',
    cols : teamListTableLabels,
    data : teamData
  };

  return component.table(medientListTable), component.table(teamListTable);
}

application.add('accounts', accounts);
