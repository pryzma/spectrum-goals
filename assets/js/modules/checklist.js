const checklist = {
    name : 'Checklist',
    default : checklistOverview
}
const checklistData = {
    url : 'api/checklist'
}
function checklistOverview(){
    const checklistOverviewTable = {
        el : 'checklistOverview',
        model : 'Account',
        data : checklistData
    }
    return component.table(checklistOverviewTable)
}
application.add('checklist',checklist);