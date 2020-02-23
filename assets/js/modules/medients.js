'use strict';
const medients = {
    name : 'Mediëntenlijst',
    default : medientOverview,
    template : 'medient_list'
};

function medientOverview(){
    return component.table({
        el : '#medientOverview',
        model : 'Account',
        data : {
            url : 'api/accounts/medients'
        }
    });
}

application.add('medients',medients);