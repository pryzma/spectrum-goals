 /** dashboard module object */
const showmedientOverviewAlt =true;
const dashboard = {
    name : 'Dashboard',
    default : medientOverview,
    template : 'dashboard',
    medient_dashboard:{
        default : medientDashboard
    },
    medientContacts : [],
    targetsSubjects : [],
    medientTargets : [],
    medientEvaluations : []
}
// ........................................
/** medients data */
const medients = { data : [] }
/** medients data modifier */
const medientDataModify = (medient) => {
    
    const medientAdd = showmedientOverviewAlt ? {
        name : medient.firstName + ' ' +  medient.lastName,
        subjects : 5,
        prog1 : 1,
        prog2 : 2,
        prog3 : 2
        
    } : {
        name : medient.firstName + ' ' +  medient.lastName,
        subjects : 5,
        prog : '<div class="progress" style="font-size:1.2em; background:none; height:30px;"><div class="progress-bar redbg" role="progressbar" style="width: 20%; text-align:center !important;" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">1</div><div class="progress-bar bg-success yellowbg" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">2</div><div class="progress-bar bg-info greenbg" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">2</div></div>'
    }
    return { ...medient, ...medientAdd }
}
/** medients overview table column labels */
const medientOverviewTableLabels = showmedientOverviewAlt ? {

    name : { label : 'Naam' },
    subjects : { label : 'Onderwerpen' },
    prog1 : { label : '< 25%'},
    prog2 : { label : '< 60%'},
    prog3 : { label : '> 60%'}
  } : {
    name : { label : 'Naam' },
    subjects : { label : 'Onderwerpen' },
    prog : { label : 'Voortgang'}
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
    callback : (data) => {
        medients.data = data
        $('#medientOverview table thead tr').append($('<th></th>').attr('style','width:1%'));
        for(const medient of data){

            let date = new Date();
            let three = new Date(date.setMonth(date.getMonth() + 3));
            const medientIndicationDateExpired = new Date( medient.indication)
            $(`tr#${medient.id}`).append('<td></td>')
            const medientTableRowLastCol = $(`tr#${medient.id} td:last-child`)
            const medientIndicationExpiredIcon = $('<i class="fas fa-exclamation-circle"></i>').attr('style','')
            if (three > medientIndicationDateExpired)  {
                medientIndicationExpiredIcon.on('click',()=>{
                    moment.locale('nl');
                    component.modal({
                        title : 'Indicatie gaat verlopen',
                        body : 'Indicatie '+ medient.name +' verloopt '+ moment(medient.indication).fromNow() +' ('+moment(medient.indication).format('LL')+')',
                        buttons : [
                            { txt : 'Sluiten', event : ['click',()=>{
                                $('#amModal').modal('hide')
                            }]}
                        ]
                    })
                })
                medientTableRowLastCol.append(medientIndicationExpiredIcon)
        
        
            } 
        }
    }
}
const targetsSubjectsData = {
    url : 'api/subjects',
    callback : (subjects) => {
        dashboard.targetsSubjects = subjects
    }
}

function getTargetsSubjects(callback){
    api.component(targetsSubjectsData,()=>callback)
}
// ........................................
/**
 * displays medients overview
 */

function medientOverview(view){
    if(showmedientOverviewAlt){

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
    }else{
        component.table({
            el : '#medientOverviewAlt',
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
          $('#homeBreadCrumb').html('<a href="#">Home</a>')
          const medientBreadCrumb = $('<li></li>')
            .attr('class','breadcrumb-item active')
            .attr('id','medientBreadCrumb')
            .html(medient[0].name);
         $('.breadcrumb').append(medientBreadCrumb);
         
    dashboardElement.data( 'medient' ,medient );
    $.get('html/templates/medientDashboard.html', (medientDashboard) => {
        
        location.hash = '#'+medient[0].id;
        dashboardMainElement.html(medientDashboard);
        $('.medientName').html(medient[0].name)
        medientPersonalInfo(medient)
        medientContacts(id)
        //medientTargets(id)
        medientGetTargets(id)
        medientEvaluationOverview(id)
    });
    
}
// ........................................


function medientEvaluationOverview(id){
    component.api({
        url : 'api/evaluations/medient/'+id,
        callback : (evaluations) => {
            const overviewMedientEvaluationElement = $('#overviewMedientEvaluation').html('')
            $('#addMedientEvaluation').off().on('click',()=>{
                medientEvaluationAdd(id)
            })
            dashboard.medientEvaluations = evaluations;
            
            if(evaluations.length > 0 ){
                evaluations.map((evaluation)=>{
                   
                    const overviewMedientEvaluationItemContentElement = $('<div></div>')
                        .attr('class','medientEvaluationContent')
                        .html(evaluation.evaluation)
                    const overviewMedientEvaluationItemHeaderElement = $('<h3></h3>')
                        .attr('class','medientEvaluationHeader')
                        .html(evaluation.date)
                    const overviewMedientEvaluationItemElement = $('<div></div>')
                        .attr('id',evaluation.id)
                        .attr('class','medientEvaluation')
                        .append(overviewMedientEvaluationItemHeaderElement)
                        .append(overviewMedientEvaluationItemContentElement)
                    
                    overviewMedientEvaluationElement.append(overviewMedientEvaluationItemElement)
                });
            }else{
                overviewMedientEvaluationElement.html('Er zijn geen evaluaties voor huidige medient toegevoegd.')
            }
            
            
        }
    });
}


function medientEvaluationAdd(id){
    const medientEvaluationAddForm = component.form.fromModel({
        id : 'medientEvaluationAddForm',
        model : 'Evaluation',
        fields : {
            //date : { label : 'Datum' },
            evaluation : { label : 'Evaluatie', type : 'textarea' }
        }
    });
    
    component.modal({
        title : 'Evaluatie toevoegen',
        body : medientEvaluationAddForm,
        open : ()=>{
            $('input#date').attr('autocomplete','off').datepicker({
                startDate :  new Date(),
                format: 'dd-mm-yyyy',
                autoclose : true,
                language : 'nl'
              }).on('show',(e)=>{             
                $('.datepicker')
                    .addClass('shadow-lg')
                    .attr('style',$('.datepicker').attr('style').replace('top: 91px;','top: 171px !important;') )
                
              })
        },
        buttons : [{ txt : 'Opslaan', event : ['click',() => {
            const medientEvaluationAddData = component.form.fields({el : '#medientEvaluationAddForm' });
            medientEvaluationAddData.medient = id;
            medientEvaluationAddData.evaluation = $('#evaluation').val()
            component.api({
                url : 'api/evaluations',
                method: 'post',
                data : medientEvaluationAddData,
                callback : ()=>{
                    $('#amModal').modal('hide');
                    medientEvaluationOverview(id);
                   
                }
            });
            
        }]},
        {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
            $('#amModal').modal('hide')
        }]}]
    });
}
// ........................................


function medientTargetsOverview(){
  
    component.table({
        el : '#medientTargets',
        model : 'Target',
        data : dashboard.medientTargets
    })
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
    const indication = medient[0].indication.split('T')[0].split('-')
    const indicationElement = $('input#indication').val(`${indication[2]}-${indication[1]}-${indication[0]}`)
    //$('input#indication').remove()
    //$('#indicationContainer').append(indicationElement)

    let date = new Date();
    let three = new Date(date.setMonth(date.getMonth() + 3));
    const medientIndicationDateExpired = new Date( medient[0].indication)
    if (three > medientIndicationDateExpired)  {
        
        $('input#indication').addClass('medientIndicationExpired')
        
    } else {
        $('input#indication').removeClass('medientIndicationExpired')
    }

    $('#medientAdditionalInfo').off().on('click',()=>medientAdditionalInfo(medient));

    $('button#medientEditBtn').on('click',()=>{
        $('input#indication').removeClass('medientIndicationExpired')
        location.hash = '#'+medient[0].id+'/edit'
        $('#medientPersonalInfo input').removeAttr('disabled');
        $('#medientEdit').hide();
        $('#medientSave').show();
        $('input#indication').datepicker({
            startDate :  new Date(),
            autoclose : true,
            format: 'dd-mm-yyyy',
            language : 'nl'
        }).on('show',(e)=>{
            $('.datepicker').addClass('shadow')
            $('input#indication').removeClass('medientIndicationExpired')
        }).on('changeDate',(e)=>{
            let date = new Date();
            let three = new Date(date.setMonth(date.getMonth() + 3));
            const medientIndicationDateExpired = new Date( medient[0].indication)
            if (three > medientIndicationDateExpired)  {
        
                $('input#indication').addClass('medientIndicationExpired')
        
            }
        });

        $('#medientSaveBtn').off().on('click',medientPersonalInfoSave);
        $('#medientEditCancelBtn').on('click',()=>{
            location.hash = '#'+medient[0].id
            $('#medientPersonalInfo input').attr('disabled','disabled');
            $('#medientEdit').show();
            $('#medientSave').hide();
        })
    })
}

/** Additional Medient Data */
function medientAdditionalInfo(medient){
    const medientAdditionalInfoForm = component.form.fromModel({
        model : 'Medient',
        id : 'medientAdditionalInfoForm',
        fields :{
            BSN : {label :'BSN'},
            date_of_birth: {label :'Geboortedatum'},
            gender: {label :'Geslacht'},
            order_number: {label :'Beschikkingsnummer'},
            product_category: {label :'Productcategorie'},
            start_date: {label :'Startdatum'},
            product_code: {label :'Productcode'},
            volume: {label :'Volume'},
            time_unit: {label :'Tijdseenheid'},
            btw_exemption: {label :'BTW Ontheffing'},
            btw_percentage: {label :'BTW Percentage'},
            btw_amount: {label :'BTW'},
            declaration_amount: {label :'Declaratie'},
            reference_number_credit: {label :'Rekeningnummer'},
            allocation_number: {label :'Toewijzingsnummer'}
        }
    });
    
    component.modal({
        title :  'Gegevens <b>'+ medient[0].name +'</b>',
        body : medientAdditionalInfoForm,
        buttons : [
            { txt : 'Opslaan', event : ['click',()=>{
                const medientAdditionalInfoData = component.form.fields({el : '#medientAdditionalInfoForm'});
                const medientAdditionalInfoData_ = {
                    BSN : medientAdditionalInfoData.BSN
                }
                medientAdditionalInfoData.id = medient[0].id;
               
                axios.put('api/medients',medientAdditionalInfoData ).then((response) => {
                    $('#amModal').modal('hide')
                    for(let item in medientAdditionalInfoData){
                        medient[0][item] = medientAdditionalInfoData[item]
                    }
                    medientPersonalInfo(medient)
                    component.alert({message : '<i class="fas fa-pen"></i> Gegevens aangepast'})
                    
                }).catch(error => {
                });
                
                
            }]},
            { txt : 'Sluiten', class : 'secondary',event : ['click',()=>{
                $('#amModal').modal('hide')
            }]}
        ],
        open : ()=>{
            //$('.modal-dialog').addClass('modal-lg'); // resize modal
            $('#medientAdditionalInfoForm label').removeClass('col-sm-2').addClass('col-sm-4');
            $('#medientAdditionalInfoForm .form-group div').removeClass('col-sm-10').addClass('col-sm-8');
            
            for(let item in medient[0]){
                if(document.querySelector('#medientAdditionalInfoForm #'+item)){
                    document.querySelector('#medientAdditionalInfoForm #'+item).value = medient[0][item];
                }
            }
        },
        close : ()=>{
            //$('.modal-dialog').removeClass('modal-lg');
        }
    });
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
                const medientIndicationDateExpired = new Date( medientPersonalInfoData.indication.split('-')[2]+'-'+medientPersonalInfoData.indication.split('-')[1]+'-'+medientPersonalInfoData.indication.split('-')[0])
                
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

function medientTargets(id){
    console.log(id)
    medientGetTargets(id)
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
    const $medientContactForm = medientContact({id:'medientAddContactForm'});
    $('#medientPersonalInfoContainer').append($medientContactForm)
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
            .html($medientContactElement.html());
    if(contact.id === 'medientAddContactForm') $('#medientAddContactForm .medientContactOptions').remove()
    return $medientContact
}
// ........................................
/** gets medient contacts data */
function medientGetContacts(id){
    //console.log(id)
    const $medientPersonalInfoElement =  $('#medientPersonalInfoContainer'),
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
                $medientPersonalInfoElement.append($medientContact);
                //$medientContact.hide();
                //const $medientContactItem = $('.medientContactItem').on('click',(e)=>{
                //    $medientContact.show()
                //    $('.medientContactItem').hide()
                //});
                //$medientContactItem.attr('id',medientContactElementId+'_item')
                $('#'+medientContactElementId+'_item .medientRelation').html(contact.relation)
                console.log(contact.first_name+' '+contact.last_name)
               
                //$medientContact.before($medientContactItem)
                $('#'+medientContactElementId+'_item .medientContactName').val(contact.first_name+' '+contact.last_name);
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
const medientTargetDataModify = (medientTarget) => {
    
    const medientTargetAdd =  {
        name : medientTarget.name,
        progress : 2
        
    } 
    return { ...medientTarget, ...medientTargetAdd }
}
function medientGetTargets(id){
    console.log(id)
    const medientTargetsData = {
        url : 'api/targets/medient/'+id,
        modify : medientTargetDataModify
    }
    
   component.table({
       el : '#medientTargets',
       model : 'Target',
       data : medientTargetsData,
       cols : { name : { label : 'Leerdoel' }, progress : { label : 'Voortgang' }}
   });
   
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