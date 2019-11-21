const medients = {
    name : 'Mediëntenlijst',
    default : medientOverview,
    template : 'medient_list'
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
application.add('medients',medients);