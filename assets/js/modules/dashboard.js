const dashboard = {
    name : 'Dashboard',
    default : medientOverview
}
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
application.add(dashboard);