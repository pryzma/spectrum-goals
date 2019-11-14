const dashboard = {
    name : 'Dashboard',
    default : medientOverview
}
const medientData = {
    url : 'api/accounts/medients'
}
function medientOverview(){
    const medientOverviewTable = {
        el : 'medientOverview',
        model : 'Account',
        data : medientData
    }
    return component.table(medientOverviewTable)
}
application.add(dashboard);