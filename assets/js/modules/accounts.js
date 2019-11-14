const accounts = {
    name : 'Accounts',
    default : accountsOverview
}
const accountsData = {
    url : 'api/accounts'
}
function accountsOverview(){
    const accountsOverviewTable = {
        el : 'accountsOverview',
        model : 'Account',
        data : accountsData
    }
    return component.table(accountsOverviewTable)
}
application.add(accounts);