'use strict';
const targets = {
    name : 'Leerdoelen',
    default : targetsOverview,
    template : 'targets'
}
const targetsData = {
    url : 'api/targets',
    modify : (item) => {

    }
}
const medientsObj = { data : [] };
const medientObjDataModify = (account) => {
    const accountAdd = {
      name : account.firstName + ' ' +  account.lastName
    };
    return { ...account, ...accountAdd };
  };

const medientsObjData = {
    url : 'api/accounts/medients',
    modify : medientObjDataModify,
    callback : (data) => medientsObj.data = data
  };

function categoryName(category){
    if(category==='work'){
        return 'Werk'
    }else{
        return 'Persoonlijk'
    }
    
}
function targetsOverview(){
    component.api(medientsObjData)
    $('#targetCategoriesContent .tab-pane').each(function(){
                        
        if($(this).hasClass('active')){

            overviewSubjects($(this).attr('data-category'))
        }
    });
 
    $('#addSubject').on('click',addSubject)
    $('#targetCreateBtn').on('click',targetCreate)
    
}

function addTarget(subject){
    const addTargetForm = component.form.fromModel({
        id : 'addTargetForm',
        model : 'Target',
        fields : {
            name : { label : 'Naam' }
        }
    });
    component.modal({
        title : 'Leerdoel toevoegen',
        body : addTargetForm,
        buttons : [{ txt : 'Opslaan', event : ['click',() => {
            const AddTargetData = component.form.fields({el : '#addTargetForm' });
            AddTargetData.subject = subject;
            
            component.api({
                url : 'api/targets',
                method: 'post',
                data : AddTargetData,
                callback : ()=>{
                    $('#amModal').modal('hide');
                    $('#targetCategoriesContent .tab-pane').each(function(){
                        
                        if($(this).hasClass('active')){
                
                            overviewSubjects($(this).attr('data-category'))
                        }
                    })
                }
            });
            
        }]}]

    })
}
function addSubject(){
    const addSubjectForm = component.form.fromModel({
        id : 'addSubjectForm',
        model : 'Subject',
        fields : {
            name : { label : 'Naam' }
        }
    });
    component.modal({
        title : 'Onderwerp toevoegen',
        body : addSubjectForm,
        buttons : [{ txt : 'Opslaan', event : ['click',() => {
            const AddSubjectData = component.form.fields({el : '#addSubjectForm' });
            AddSubjectData.category = 
            component.api({
                url : 'api/subjects',
                method: 'post',
                data : AddSubjectData,
                callback : ()=>{
                    $('#amModal').modal('hide');
                
                    $('#targetCategoriesContent .tab-pane').each(function(){
                        
                        if($(this).hasClass('active')){

                            overviewSubjects($(this).attr('data-category'))
                        }
                    })
                }
            });
            
        }]}]
    })
}
function overviewSubjects(category){
    $('#targets').data('category',category)
    $('#categoryBreadcrumb').remove();
    const categoryBreadcrumb = $('<li></li>')
        .addClass('breadcrumb-item active')
        .attr('id','categoryBreadcrumb')
        .html(categoryName(category))
    $('#targetsBreadcrumbs').append(categoryBreadcrumb);
    component.api({
        url : 'api/subjects',
        callback : (subjects) =>{
            const subjectsContainer = $(`#${category}Subjects div.row`)
            $('.subjectContainer').remove()
            for(const subject of subjects){
               
                    const addTargetBtn = component.btn({ 
                            html : '<i class="fas fa-plus"></i> Leerdoel toevoegen', 
                            event : ['click',()=>addTarget(subject.id)],
                            class : 'btn-nobg btn-block text-muted left addTarget'
                          }),
                          targetBtnsContainer = $('<div></div>').attr('class','targetBtnsContainer'),
                          subjectDeleteBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','margin-top:-40px;')
                            .html('<i class="fas fa-times"></i>')
                            .on('click',()=>subjectDelete(subject)),
                          subjectUpdateBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','margin-top:-40px; margin-right:20px;')
                            .html('<i class="fas fa-pen"></i>')
                            .on('click',()=>subjectUpdate(subject)),
                          subjectOptions = $('<div></div>')
                            .attr('class','subjectOptions float-right')
                            .attr('style','z-index:1;')
                            .append(subjectDeleteBtn)
                            .append(subjectUpdateBtn),
                          subjectHeader = $('<p></p>')
                            .addClass('subjectHeader h4 bold green center')
                            .attr('id',`subjectHeader_${subject.id}`)
                            .html(subject.name),
                          subjectContainer = $('<div></div>')
                            .attr('id',subject.id)
                            .attr('class','subjectContainer card shadow')
                            .html(subjectHeader)
                            .addClass('col-md-3')
                            .append(targetBtnsContainer)
                            .append(addTargetBtn)
                          component.api({
                            url : 'api/targets',
                            callback : (targets)=>{
                            
                                subjectTargetsBtns({
                                  targets : targets,
                                  container :  targetBtnsContainer,
                                  subject : subject,
                                  callback : ()=>{
                                    
                                    $(`#${subject.id} div.targetBtnsContainer`)
                                    .sortable({
                                        start : function( event, ui ) {
                                            $(event.target).addClass('grabbing')
                                            //console.log(ui)
                                        },
                                        stop : function( event, ui  ) {
                                            $(event.target).removeClass('grabbing')
                                        }
                                    })
                                    .disableSelection();
                                  }
                                })
                                
                          }
                    })
                    subjectsContainer.prepend(subjectContainer);
                    $(`#subjectHeader_${subject.id}`).after(subjectOptions)
                    $('#targetsSearch').on('input', (event) => {
                        let value = $(`#${event.target.id}`).val();
                        let arr = $(`#${category}Subjects button`);
                        let filter = new RegExp(value, 'i');
                        for (let i = 0; arr.length > i; i++) {
                          if (filter.test(arr[i].textContent)) {
                            arr[i].style.display = "block";
                          } else {
                            arr[i].style.display = "none";
                          }
                        }
                      });
                //}

            }
        }
    })

}
function subjectDelete(subject){
                                
    component.modal({
        title : '<i class="fas fa-times"></i> Onderwerp  verwijderen',
        body : 'Weet je zeker dat je <b>'+subject.name+ '</b> (en onderliggende leerdoelen, (sub)levels) wilt verwijderen?',
        buttons : [
            {txt : 'Bevestigen', event:['click',()=>{
                component.api({
                    method : 'delete',
                    url : `api/subjects/${subject.id}`,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        overviewSubjects(category)
                        component.alert({
                            message : `<i class="fas fa-times"></i> Onderwerp verwijderd`
                        })
                    }
                });
            }]},
            {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
                $('#amModal').modal('hide')
            }]}
        ]
    })
    
}
function subjectUpdate(subject){
    const updateSubjectForm = component.form.fromModel({
        id : 'updateSubjectForm',
        model : 'Subject',
        fields : {
            name : { label : 'Naam', value : subject.name }
        }
    });
    component.modal({
        title : 'Leerdoel aanpassen',
        body : updateSubjectForm,
        buttons : [{txt : 'Opslaan', event : ['click', () => {
                
                subject.name = $('#updateSubjectForm #name').val()
                axios.put('api/subjects',subject ).then(() => {
                    $('#amModal').modal('hide')
                    component.alert({message : '<i class="fas fa-pen"></i> Onderwerp aangepast'})
                    //overviewSubjects($('#targets').data('category'))
                    targetsOverview()
                }).catch(error => {
                    
                });
            }]
        }]
    })
}
function addTargetLevel(target){
    const addTargetLevelForm = component.form.fromModel({
        id : 'addTargetLevelForm',
        model : 'Level',
        fields : {
            name : { label : 'Naam' }
        }
    });
    
    component.modal({
        title : 'Level toevoegen',
        body : addTargetLevelForm,
        buttons : [{ txt : 'Opslaan', event : ['click',() => {
            const AddTargetLevelData = component.form.fields({el : '#addTargetLevelForm' });
            AddTargetLevelData.subject = target.subject
            AddTargetLevelData.target = target.id
            component.api({
                url : 'api/levels',
                method: 'post',
                data : AddTargetLevelData,
                callback : ()=>{
                    $('#amModal').modal('hide');
                    overviewTargetLevels(target)
                   
                }
            });
            
        }]}]
    });
}


function overviewTargetLevels(target){

    $('#overviewTargetAssignMedientInput').off().on('input',(event)=>{
      
        const searchTargetAssignMedientValue = event.target.value
        searchTargetAssignMedientValue === '' ? $('#TargetAssignMedients').hide() : $('#TargetAssignMedients').show() 
      
        $('#TargetAssignMedients').html('')
        medientsObj.data.map((medient)=>{
            const searchTargetAssignMedientElement = $('<p>'+medient.name+'</p>')
            .attr('style','margin-bottom:0px;')
            .on('click',()=>{
                component.modal({
                    title : 'Leerdoel toewijzen aan Medient',
                    body : 'Weet je zeker dat je leerdoel <b>'+target.name+'</b> wil toewijzen aan '+medient.name,
                    buttons : [ { txt : 'Bevestigen', onClick : ()=>{
                        component.api({
                            method : 'post',
                            url : 'api/medients/target/add',
                            data : {
                                medient : medient.id,
                                target : target.id
                            },
                            callback : ()=>{
                                component.alert({
                                    message : 'Leerdoel <b>'+target.name+'</b> is toegewezen aan '+medient.name
                                })
                            }
                        })
                    }}]
                })
            })
            $('#TargetAssignMedients')
                .append(searchTargetAssignMedientElement)
                

        })
        let value = $(`#${event.target.id}`).val();
        let arr = $(`#TargetAssignMedients p`);
        let filter = new RegExp(value, 'i');
        for (let i = 0; arr.length > i; i++) {
          if (filter.test(arr[i].textContent)) {
            arr[i].style.display = "block";
          } else {
            arr[i].style.display = "none";
          }
        }
        
    })
    $('.breadcrumb-item').removeClass('active');
    $('#targetSubjectBreadcrumb').remove();
    const targetSubjectBreadCrumb = $('<li></li>')
        .attr('id','targetSubjectBreadcrumb')
        .addClass('breadcrumb-item')
        .html(target.name);
    $('#targetsBreadcrumbs').append(targetSubjectBreadCrumb);
    
   
    $('#overviewTargetLevelsBtns').html('');
    component.api({
        url : `api/levels/${target.id}`,
        callback : (levels) => {
            $('#targetCategoriesContent').hide();
            $('#overviewTargetLevels').show();
            location.hash = '#'+target.id;
            $('#targetCategoriesTabs').off().on('click',function(){
                $('#overviewTargetLevels').hide();
                $('#targetCategoriesContent').show();
            });
            $('.overviewTargetName').html(target.name);
            $('#addTargetLevel').off().on('click',()=>addTargetLevel(target));
            for(const levelIndex in levels){
                const levelBtn = component.btn({
                    txt : `Level ${levelIndex/1+1} : ${levels[levelIndex].name}`,
                    class : 'block left btn-primary btn-green'
                }),
                    levelElement = $('<div></div')
                     .attr('class','levelContainer btn btn-block left btn-primary btn-green ui-sortable-handle pointer'),
                    levelLabel = $('<div></div>')
                      .html(`Level ${levelIndex/1+1} : ${levels[levelIndex].name}`)
                    levelElement.append(levelLabel);
                    const levelDeleteBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','margin-top:-40px;')
                            .html('<i class="fas fa-times"></i>')
                            .on('click',()=>levelDelete(levels[levelIndex])),
                          levelUpdateBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','margin-top:-40px; margin-right:20px;')
                            .html('<i class="fas fa-pen"></i>')
                            .on('click',()=>levelUpdate(levels[levelIndex])),
                          levelOptions = $('<div></div>')
                            .attr('class','levelOptions float-right')
                            .attr('style','z-index:1; padding-top:10px;')
                            .append(levelDeleteBtn)
                            .append(levelUpdateBtn)
                          levelElement.append(levelOptions);

                    


                $('#overviewTargetLevelsBtns').append(levelElement)
            }
            $('#overviewTargetLevelsBtns').sortable({
                start : function( event, ui ) {
                    $(event.target).addClass('grabbing')
                    //console.log(ui)
                },
                stop : function( event, ui  ) {
                    $(event.target).removeClass('grabbing')
                }
            });
        }
    });
    
      

}

function subjectTargetsBtns(args){
    // https://jqueryui.com/sortable/ ; sorteren targets

    for(const target of args.targets){
        if(target.subject === args.subject.id){
            const targetBtn = component.btn({
                txt : target.name,
                class : 'yellow btn-block left ui-state-default',
                id : target.id,
                event : ['click',()=>{
                    overviewTargetLevels(target)
                }]
            })
            const targetElement = $('<div></div>')
                                        .addClass('btn btn-yellow btn-block left pointer shadow')
                                        .on('mousedown',(e)=>{
                                            $(e.target).addClass('grabbing')
                                        })
                                        .on('mouseup',(e)=>{
                                            $(e.target).removeClass('grabbing')
                                        })
            const targetElementLabel = $('<div></div>')
                                         .html(target.name)
                                         .attr('style','width:80%')
                                         .attr('class','targetElementLabel')
                                         .addClass('pointer')
                                         .on('click',()=>{
                                            overviewTargetLevels(target)
                                         })
            targetElement.append(targetElementLabel)
            const targetDeleteBtn = $('<button></button>')
                .attr('class','btn btn-nobg')
                .html('<i class="fas fa-times"></i>')
                .on('click',(event)=>targetDelete(target))
            //targetElement.append(targetDeleteBtn)
            const targetUpdateBtn = $('<button></button>')
            .attr('class','btn btn-nobg')
            .html('<i class="fas fa-pen"></i>')
            .on('click',(event)=>targetUpdate(target))

            
            const targetOptions = $('<div></div>')
                .attr('class','targetOptions float-right')
                .attr('style','margin-top:-38px;')
            
            const targetContainer = $('<div></div>')
                .attr('class','targetContainer')
                .attr('id',component.uid())
            
            
            targetOptions.append(targetUpdateBtn);
            targetOptions.append(targetDeleteBtn);
            targetElement.append(targetOptions);
            targetContainer.append(targetElement);

            args.container.prepend(targetContainer);


        }
        
    }
    if(args.callback) args.callback()
}
function targetCreate(){
    $.get('html/templates/targetCreate.html', (data) => {
        $(application.config.main).html(data);
    
      });
}
function targetDelete(target){
    component.modal({
        title : 'Leerdoel verwijderen',
        body : 'Weet je zeker dat je <b>'+target.name+'</b> wilt verwijderen?',
        buttons : [
            { txt : 'Bevestigen', event : ['click',()=>{
                component.api({
                    method : 'delete',
                    url : 'api/targets/'+target.id,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        targetsOverview()
                    }
                })
            }]}
        ]
    })
}
function targetUpdate(target){
    const updateTargetForm = component.form.fromModel({
        id : 'updateTargetForm',
        model : 'Target',
        fields : {
            name : { label : 'Naam', value : target.name }
        }
    });
    component.modal({
        title : 'Leerdoel aanpassen',
        body : updateTargetForm,
        buttons : [{txt : 'Opslaan', event : ['click', () => {
                
                target.name = $('#updateTargetForm #name').val()
                axios.put('api/targets',target ).then(() => {
                    $('#amModal').modal('hide')
                    component.alert({message : '<i class="fas fa-pen"></i> Leerdoel aangepast'})
                    //overviewSubjects($('#targets').data('category'))
                    targetsOverview()
                }).catch(error => {
                    
                });
            }]
        }]
    })
}
application.add('targets',targets);