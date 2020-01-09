 /** dashboard module object */
const dashboard = {
    name : 'Dashboard',
    default : medientOverview,
    template : 'dashboard',
    medient_dashboard:{
        default : medientDashboard
    },
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

    component.table({
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
    });
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
    $.get('html/templates/medientDashboard.html', (medientDashboard) => {
        location.hash = '#'+medient[0].id;
        dashboardMainElement.html(medientDashboard);
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
    const indication = medient[0].indication.split('T')[0]
    const indicationElement = $('input#indication').val(indication)
    //$('input#indication').remove()
    //$('#indicationContainer').append(indicationElement)
    let date = new Date();
    let three = new Date(date.setMonth(date.getMonth() + 3));
    const medientIndicationDateExpired = new Date( medient[0].indication)
    if (three > medientIndicationDateExpired)  {
        
        $('input#indication').addClass('medientIndicationExpired')
        
    }
    $('button#medientEditBtn').on('click',()=>{
       // $('input#indication').removeClass('medientIndicationExpired')
        location.hash = '#'+medient[0].id+'/edit'
        $('#medientPersonalInfo input').removeAttr('disabled');
        $('#medientEdit').hide();
        $('#medientSave').show();
        $('#medientSaveBtn').on('click',medientPersonalInfoSave);
        $('#medientEditCancelBtn').on('click',()=>{
            location.hash = '#'+medient[0].id
            $('#medientPersonalInfo input').attr('disabled','disabled');
            $('#medientEdit').show();
            $('#medientSave').hide();
        })
    })
}
/** saves medient personal info edit  */
function medientPersonalInfoSave(){
    //const medientFormData = component.form.data({ el : 'form#medientPersonalInfo', model : 'Account'});
    const medientPersonalInfoData = component.form.fields({
        el : 'form#medientPersonalInfo'
    })

  
        component.api({
            method : 'put',
            url : 'api/accounts',
            data : medientPersonalInfoData,
            callback : (data)=> {
                let date = new Date();
                let three = new Date(date.setMonth(date.getMonth() + 3));
                const medientIndicationDateExpired = new Date( medient[0].indication)
                if (three > medientIndicationDateExpired)  {
        
                    $('input#indication').addClass('medientIndicationExpired')
        
                }else{
                    $('input#indication').removeClass('medientIndicationExpired')
                }
                $('#medientPersonalInfo input').attr('disabled','disabled');
                $('#medientEdit').show();
                $('#medientSave').hide();
                component.alert({class:'success',message:'<i class="fas fa-check"></i> Gegevens medient aangepast'});
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
    $('#medientAddContactSaveBtn').off().on('click',medientPostAddContactForm);
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
            contacts.map((contact, index)=>{
                const medientContactElementId = 'medient_contact_'+index;
                const $medientContact = medientContact(contact)
                    .attr('id',medientContactElementId)
                    .attr('data-id',contact.id)
                    .addClass('medient_contact')
                $medientPersonalInfoElement.after($medientContact);
                /** map contact object keys to input fields */
                Object.keys(contact).map((key, index) => $(`#${medientContactElementId} input#${key}`).val(contact[key]));
                /** update medient contact */
                $(`#${medientContactElementId} .medientContactOptions button.medientEditContact`).on('click',medientContactUpdate);
                $(`#${medientContactElementId} .medientContactOptions button.medientDeleteContact`).on('click',medientContactDelete);
            })
        }
    }
    component.api(medientContactsData);
}
function medientContactDelete(event){
    event.preventDefault();
    const medientContactElementId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.id
    const medientContactId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
    const medientId = $(`#${medientContactElementId} input#medient`).val();
    const medientName = $(`#${medientContactElementId} input#first_name`).val() + ' ' + $(`#${medientContactElementId} input#last_name`).val()
    
    console.log(medientContactId)
    component.api({
        method : 'delete',
        url : 'api/contacts/'+medientContactId,
        data : { id : medientContactId},
        callback : ()=>{
            medientGetContacts(medientId);
            component.alert({class:'primary',message:'<i class="fas fa-user-times"></i> Contact <b>' + medientName +'</b> verwijderd'});
        }
    })
}
/** updates medient contact */
function medientContactUpdate(event){
    event.preventDefault()
    const medientContactElementId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    const medientContactId = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
    const medientId = $(`#${medientContactElementId} input#medient`).val();
    const medientName = $(`#${medientContactElementId} input#first_name`).val() + ' ' + $(`#${medientContactElementId} input#last_name`).val()
    
    if(medientContactElementId != 'medientPersonalInfoContainer'){
        $(`#${medientContactElementId} input`).removeAttr('disabled')
       
        $(`#${medientContactElementId} input#first_name`).focus()
        $(`#${medientContactElementId} .medientContactEditSave`).show()
        $(`#${medientContactElementId} .medientContactEdit`).hide()
        $(`#${medientContactElementId} .medientAddContactEditCancelBtn`).on('click',(event)=>{
            event.preventDefault()
            $(`#${medientContactElementId} input`).attr('disabled','disabled')
            $(`#${medientContactElementId} .medientContactEdit`).show()
            $(`#${medientContactElementId} .medientContactEditSave`).hide()
        });
        $(`#${medientContactElementId} .medientContactEditSaveBtn`).on('click',(event)=>{
            event.preventDefault();
      
            const medientContactData = component.form.fields({
                el : `#${medientContactElementId}`
            })
            medientContactData.id = medientContactId
     
                component.api({
                    method : 'put',
                    url : 'api/contacts',
                    data : medientContactData,
                    callback : () => {
                        medientGetContacts(medientId)
                        component.alert({class:'success',message:'<i class="fas fa-user-edit"></i> Gegevens <b>' + medientName +'</b> zijn aangepast'});
                    }
                })
            
            
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
        callback : (res)=>{
            
            $('#medientAddContactForm').remove();
            $('#medientAddContact').show();
            $('#medientAddContactSave').hide();
            medientGetContacts(res.data.medient)
            component.alert({class:'success',message:'<i class="fas fa-user-plus"></i> Contact <b>' + res.data.first_name + ' ' + res.data.last_name + '</b> toegevoegd'});
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