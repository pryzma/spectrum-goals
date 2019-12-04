 /** dashboard module object */
const dashboard = {
    name : 'Dashboard',
    default : medientOverview,
    template : 'dashboard',
    medientContacts : []
}
// ........................................
/** medients data */
const medients = { data : [] }
/** medients data modifier */
const medientDataModify = (medient) => {
    const medientAdd = {
        name : medient.firstName + ' ' +  medient.lastName,
        subjects : 5,
        prog1 : 1,
        prog2 : 2,
        prog3 : 2
        
    }
    return { ...medient, ...medientAdd }
}
/** medients overview table column labels */
const medientOverviewTableLabels = {

    name : { label : 'Naam' },
    subjects : { label : 'Onderwerpen' },
    prog1 : { label : '< 25%'},
    prog2 : { label : '< 60%'},
    prog3 : { label : '> 60%'}
  }
 /** API data component object
  * @param {string} url 
  * @param {function} modify data modifier
  * @param {function} callback
  */
const medientData = {
    url : 'api/accounts/medients',
    /**@param {object} medient medient data */
    modify : medientDataModify,
    /**@param {array} data medients data */
    callback : (data) => medients.data = data
}
// ........................................
/**
 * displays medients overview
 */
function medientOverview(){
    
    const medientOverviewTable = {
        el : '#medientOverview',
        model : 'Account',
        class : 'table-striped table-hover',
        data : medientData,
        cols : medientOverviewTableLabels,
          methods: {
            onRowClick : (event) => {
                medientDashboard(event.target.parentElement.id);         
            }
          }
    }
    return component.table(medientOverviewTable)
}
// ........................................
/**
 * loads dashboard for selected medient
 * @param {string} id 
 */
function medientDashboard(id){
    const dashboardElement = $('#dashboard'),
          dashboardMainElement = $('#dashboardMain')
          dashboardMainHtml = dashboardMainElement.html(),
          medient = medients.data.filter((medient)=>medient.id===id);
          $('.breadcrumb-item').removeClass('active');
          $('#medientBreadCrumb').remove();
          console.log(medient[0].name)
          const medientBreadCrumb = $('<li></li>')
            .attr('class','breadcrumb-item active')
            .attr('id','medientBreadCrumb')
            .html(medient[0].name);
         $('.breadcrumb').append(medientBreadCrumb);
    dashboardElement.data( 'medient' , medient );
    $.get('html/templates/medientDashboard.html', (data) => {
        dashboardMainElement.html(data);
        medientPersonalInfo(medient)
        medientContacts(id)
        medientTargets(id)
    });
    
}
// ........................................
/**
 * gets personal info for selected medient
 * @param {object} medient 
 */
function medientPersonalInfo(medient){
    const  medientPersonalInfoElement = $('#medientPersonalInfo');
    $('#medientPersonalInfo').html($('#medientPersonalInfoEdit').html())
    Object.keys(medient[0]).map((key, index) => $(`input#${key}`).val(medient[0][key]));
    $('button#medientEditBtn').on('click',()=>{
        $('#medientPersonalInfo input').removeAttr('disabled');
        $('#medientEdit').hide();
        $('#medientSave').show();
        $('#medientSaveBtn').on('click',()=>{
            const medientFormData = component.form.data({ el : 'form#medientPersonalInfo', model : 'Account'});
           
            component.api({
                method : 'put',
                url : 'api/accounts',
                data : medientFormData,
                callback : (data)=> {
                    $('#medientPersonalInfo input').attr('disabled','disabled');
                    $('#medientEdit').show();
                    $('#medientSave').hide();
                }
            })
          
        });
        $('#medientEditCancelBtn').on('click',()=>{
            $('#medientPersonalInfo input').attr('disabled','disabled');
            $('#medientEdit').show();
            $('#medientSave').hide();
        })
    })
}
// ........................................
/**
 * gets contacts for selected medient
 * @param {*} id 
 */
function medientContacts(id){
    const  $medientContactElement = $('#medientContact'),
           $medientPersonalInfoElement = $('#medientPersonalInfo');
    /** fetch medient contacts data */
    const medientContactsData = {
        url : 'api/contacts/medient/'+id,
        callback : (contacts)=>{
            contacts.map((contact)=>{
                $medientPersonalInfoElement.after(medientContact(contact));
                Object.keys(contact[0]).map((key, index) => $(`input#${key}`).val(contact[0][key]));
            })
        }
    }
    
    component.api(medientContactsData);
    /** creates medient contact element */
    function medientContact(contact){
        const $medientContact = $('<form></form>')
            .attr('id',contact.id)
            .attr('class','col-md-3')
            .html($medientContactElement.html());
        return $medientContact
    }
    /** add medient contact */
    $('#medientAddContactBtn').on('click',()=>{
        const $medientContactForm = medientContact({id:'medientAddContactForm'})
        $medientPersonalInfoElement.after($medientContactForm);
        $('#medientAddContactForm input').removeAttr('disabled');
        $('#medientAddContact').hide();
        $('#medientAddContactSave').show();
        $('#medientAddContactCancelBtn').on('click',()=>{
            $medientContactForm.remove();
            $('#medientAddContact').show();
            $('#medientAddContactSave').hide()
        })
    });
    




}
// ........................................
/**
 * gets targets for selected medient
 * @param {*} id 
 */
function medientTargets(id){
    const medientTargetsElement = $('#medientTargets')
}
application.add('dashboard',dashboard);