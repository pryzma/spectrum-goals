 /** dashboard module object */
const dashboard = {
    name : 'Dashboard',
    default : medientOverview,
    template : 'dashboard'
}
 /** API data component object */
const medientData = {
    url : 'api/accounts/medients',
    modify : (medient) => {
        // modify medient data
    }
}
function medientOverview(){
    const medientOverviewTable = {
        el : '#medientOverview',
        model : 'Account',
        data : medientData
    }
    return component.table(medientOverviewTable)
}
application.add('dashboard',dashboard);