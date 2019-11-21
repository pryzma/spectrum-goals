 /** accounts module object */
const accounts = {
    name : 'Accounts',
    default : accountsOverview
}
 /** API data component object */
const accountsData = {
    url : 'api/accounts'
}
/** Overview of accounts */
function accountsOverview(){
    /** Table component object */
    const accountsOverviewTable = {
        el : '#accountsOverview',
        model : 'Account',
        data : accountsData
    }
    return component.table(accountsOverviewTable)
    
}
application.add('accounts',accounts);