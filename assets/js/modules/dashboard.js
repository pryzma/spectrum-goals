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
          //console.log(medient[0].name)
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
        $('#medientSaveBtn').on('click',medientPersonalInfoSave);
        $('#medientEditCancelBtn').on('click',()=>{
            $('#medientPersonalInfo input').attr('disabled','disabled');
            $('#medientEdit').show();
            $('#medientSave').hide();
        })
    })
}
/** saves medient personal info edit  */
function medientPersonalInfoSave(){
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
}
// ........................................
/**
 * gets contacts for selected medient
 * @param {*} id 
 */
function medientContacts(id){
    
    /** fetch medient contacts data */
    medientGetContacts(id);
    
    /** add medient contact */
    $('#medientAddContactBtn').on('click',()=>{
        medientAddContact(id)
    });

}
// ........................................
/** creates & inserts medient add contact form  */
function medientAddContact(id){
    const $medientContactForm = medientContact({id:'medientAddContactForm'}),
          $medientPersonalInfoElement = $('#medientPersonalInfo');
    $medientPersonalInfoElement.after($medientContactForm);
    $('#medientAddContactForm input').removeAttr('disabled');
    $('#medientAddContactForm input#medient').val(id);
    $('#medientAddContact').hide();
    $('#medientAddContactSave').show();
    /** saves medient contact */
    $('#medientAddContactSaveBtn').on('click',medientPostAddContactForm);
    /** cancels add medient contact */
    $('#medientAddContactCancelBtn').on('click',()=>{
        $medientContactForm.remove();
        $('#medientAddContact').show();
        $('#medientAddContactSave').hide()
    });
}
// ........................................
 /** creates medient contact element */
 function medientContact(contact){
    const $medientContactElement = $('#medientContact'),
          $medientContact = $('<form></form>')
            .attr('id',contact.id)
            .attr('class','col-md-3')
            .html($medientContactElement.html());
    if(contact.id === 'medientAddContactForm') $('#medientAddContactForm .medientContactOptions').remove()
    return $medientContact
}
// ........................................
/** gets medient contacts data */
function medientGetContacts(id){
    //console.log(id)
    const $medientPersonalInfoElement = $('#medientPersonalInfo'),
        medientContactsData = {
        url : 'api/contacts/medient/'+id,
        callback : (contacts)=>{
            $('.medient_contact').remove();
            $('#medientContactsNum').html(contacts.length)
            /** map each contact to medientContact  */
            contacts.map((contact)=>{
                const $medientContact = medientContact(contact).addClass('medient_contact')
                $medientPersonalInfoElement.after($medientContact);
                /** map contact object keys to input fields */
                Object.keys(contact).map((key, index) => $(`#${contact.id} input#${key}`).val(contact[key]));
                /** update medient contact */
                $(`#${contact.id} .medientContactOptions button.medientEditContact`).on('click',medientContactUpdate);
            })
        }
    }
    component.api(medientContactsData);
}
/** updates medient contact */
function medientContactUpdate(event){
    event.preventDefault()
    const medientContactId = event.target.parentElement.parentElement.parentElement.parentElement.id;
    if(medientContactId != 'medientPersonalInfoContainer'){
        $(`#${medientContactId} input`).removeAttr('disabled')
       
        $(`#${medientContactId} input#first_name`).focus()
        $(`#${medientContactId} .medientContactEditSave`).show()
        $(`#${medientContactId} .medientContactEdit`).hide()
        $(`#${medientContactId} .medientAddContactEditCancelBtn`).on('click',(event)=>{
            event.preventDefault()
            $(`#${medientContactId} input`).attr('disabled','disabled')
            $(`#${medientContactId} .medientContactEdit`).show()
            $(`#${medientContactId} .medientContactEditSave`).hide()
        });
        $(`#${medientContactId} .medientAddContactEditSaveBtn`).on('click',(event)=>{
            event.preventDefault();
        });
    }
    
    
    
}
// ........................................
/** posts add medient contact form */
function medientPostAddContactForm(){
    component.form.post({
        url : 'api/contacts',
        el : 'medientAddContactForm',
        model : 'Contact',
        forceSubmit : true,
        callback : (res)=>{
            
            $('#medientAddContactForm').remove();
            $('#medientAddContact').show();
            $('#medientAddContactSave').hide();
            medientGetContacts(res.data.medient)
            component.alert({class:'success',message:res.data.first_name + ' '+ res.data.last_name +' toegevoegd aan Contacten'});
        }
    })
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