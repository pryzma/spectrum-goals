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
    callback : (data) => {
        console.log(data)
        medientsObj.data = data
    }
  };

function categoryName(category){
    if(category==='work'){
        return 'Werk'
    }else{
        return 'Persoonlijk'
    }
    
}
function targetsOverview(){
    overviewSubjects(currentCategory())
    
 
    $('.addSubject').on('click',()=>addSubject()).droppable({
        drop: function( event, ui ) {
            //console.log(ui.helper[0].id)
            addSubject(ui.helper[0].id)
           
        }
    });
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
                    overviewSubjects(currentCategory())
                }
            });
            
        }]}]

    })
}
function addSubject(target){
    
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
        buttons : [{ txt : 'Opslaan', event : ['click',() => saveSubject(target)]}]
    })
}
function currentCategory(){
    let currentCategoryValue
    $('#targetCategoriesContent .tab-pane').each(function(){
            
        if($(this).hasClass('active')){
            currentCategoryValue = $(this).attr('data-category')
        }
    })
    //console.log($('#targetCategoriesContent .tab-pane.active').attr('data-category'))
    return currentCategoryValue
}

function saveSubject(target){
    
        //const AddSubjectData = component.form.fields({el : '#addSubjectForm' });
        //AddSubjectData.category = 
        


        const AddSubjectData = {
            id : component.uid(),
            name : $('#name').val(),
            category : currentCategory()
        }
        
        component.api({
            url : 'api/subjects',
            method: 'post',
            data : AddSubjectData,
            close : ()=>{
                $('#button_container').remove();
            },
            callback : (subject)=>{
                if(target && target.type != 'click'){
                    component.api({
                        url : 'api/targets',
                        callback : (targets)=>{
                            const target_ = targets.filter((item)=>item.id===target)
                     
                            target_[0].subject = AddSubjectData.id
                            axios.put('api/targets',target_[0]).then(()=>{
                                targetsOverview(currentCategory())
                                $('#amModal').modal('hide');
                            })
                        }})
                    
                }else{
                    $('#amModal').modal('hide');
            
                    overviewSubjects(currentCategory())
                }
                
            }
        });
        
    
}
function overviewSubjects(category){
    $('#targetsBreadcrumb').html('Leerdoelen')
    $('.nav .nav-link').off().on('click',(event)=>{
        overviewSubjects($(event.target).attr('data-category'))

    });
    $('#targets').data('category',category)
    $('#categoryBreadcrumb').remove();
    $('#targetSubjectBreadcrumb').remove();
    $('#targetBreadcrumb').remove();
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
                if(subject.category === category){
                    const addTargetBtn = component.btn({ 
                            html : '<i class="fas fa-plus"></i> Leerdoel toevoegen', 
                            event : ['click',()=>addTarget(subject.id)],
                            class : 'btn-nobg btn-block text-muted left addTarget'
                          }),
                          targetBtnsContainer = $('<div></div>')
                            .attr('class','targetBtnsContainer'),
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
                            .html(subject.name.replace(/<3/g,'♥')),
                          subjectContainer = $('<div></div>')
                            .attr('id',subject.id)
                            .attr('class','col-md-3 subjectContainer card shadow')
                            .html(subjectHeader)
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
                                        },
                                        stop : function( event, ui  ) {
                                            $(event.target).removeClass('grabbing')
                                        }
                                    }).draggable()
                                    .disableSelection();
                                  }
                                })
                                
                          }
                    })
                    subjectsContainer.prepend(subjectContainer);
                    $('#'+subject.id).droppable({
                        drop: function( event, ui ) {
                            const updateMoveTarget = {
                                id : ui.helper[0].id,
                                subject : subject.id
                            }

                            axios.put('api/targets', updateMoveTarget ).then(() => {
                                $('#amModal').modal('hide')
                                component.alert({message : '<i class="fas fa-pen"></i> Leerdoel verplaatst naar '+subject.name})
                                targetsOverview()
                            })
                        }
                    })
                    $(`#subjectHeader_${subject.id}`).after(subjectOptions)
                    targetsSearch()
                }

            }
        }
    })

}
function targetsSearch(){

    $('#targetsSearch').attr('placeholder','Zoek in alle leerdoelen').on('input', (event) => {
        let value = $(`#${event.target.id}`).val();
        let arr = $(`#overviewSubjects div.btn`);
        let filter = new RegExp(value, 'i');
        for (let i = 0; arr.length > i; i++) {
          if (filter.test(arr[i].textContent)) {
            arr[i].style.display = "block";
          } else {
            arr[i].style.display = "none";
          }
        }
      });
}
function levelsSearch(){
    $('#targetsSearch').attr('placeholder','Zoek in leerdoel').on('input', (event) => {
        let value = $(`#${event.target.id}`).val();
        let arr = $(`#overviewTargetLevelsBtns .btn`);
        let filter = new RegExp(value, 'i');
        for (let i = 0; arr.length > i; i++) {
          if (filter.test(arr[i].textContent)) {
            arr[i].style.display = "block";
          } else {
            arr[i].style.display = "none";
          }
        }
      });
}
function subjectDelete(subject){
                                
    component.modal({
        title : '<i class="fas fa-times"></i> Onderwerp  verwijderen',
        body : 'Weet je zeker dat je <b>'+subject.name+ '</b> (en onderliggende leerdoelen, (sub)levels) wilt verwijderen?',
        buttons : [
            {txt : 'Verwijderen', event:['click',()=>{
                component.api({
                    method : 'delete',
                    url : `api/subjects/${subject.id}`,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        targetsOverview()
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
        title : 'Onderwerp aanpassen',
        body : updateSubjectForm,
        buttons : [{txt : 'Opslaan', event : ['click', () => {
                
                subject.name = $('#updateSubjectForm #name').val()
                axios.put('api/subjects',subject ).then(() => {
                    $('#amModal').modal('hide')
                    component.alert({message : '<i class="fas fa-pen"></i> Onderwerp aangepast'})
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
            AddTargetLevelData.subject = target.subject.id
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
            
        }]},
        {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
            $('#amModal').modal('hide')
        }]}]
    });
}


function overviewTargetLevels(target){
    levelsSearch()
    $('#targetsBreadcrumb').html('<a href="#targets">Leerdoelen</a>');
    if(typeof target[0] === 'string'){
        component.api({
            url:'api/targets/'+target,
            callback : (target)=>{
                return overviewTargetLevels(target)
            }
        })
    }
    levelsSearch(target)
    $('.overviewTargetSubjectName').html(target.subject.name)
    component.api(medientsObjData,(data)=>{
        medientsObj.data = data
        assignMedientTarget(target)
    })
    $('.breadcrumb-item').removeClass('active');
    $('#targetSubjectBreadcrumb').remove();
    const targetSubjectBreadCrumb = $('<li></li>')
        .attr('id','targetSubjectBreadcrumb')
        .addClass('breadcrumb-item')
        .html(target.subject.name.replace(/<3/g,'♥'));
    $('#targetsBreadcrumbs').append(targetSubjectBreadCrumb);
    
    $('#targetBreadcrumb').remove();
    const targetBreadCrumb = $('<li></li>')
        .attr('id','targetBreadcrumb')
        .addClass('breadcrumb-item active')
        .html(target.name.replace(/<3/g,'♥'));
    $('#targetsBreadcrumbs').append(targetBreadCrumb);
    
   
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
                levels[levelIndex].target = target
                overviewTargetSubLevels(levels[levelIndex])
                const levelLabelTxt = levels[levelIndex].name.replace(/<3/g,'♥')
                const levelLabel = $('<div></div>')
                        .html(`Level ${levelIndex/1+1} : ${levelLabelTxt}`),
                      subLevelContainer = $('<div></div')
                        .attr('class','subLevelContainer')
                        .attr('style','display:none;padding-left:25px;')
                        .attr('id',levels[levelIndex].id),
                      levelElement = $('<div></div')
                        .attr('class','levelContainer btn btn-block left btn-primary btn-green ui-sortable-handle pointer shadow')
                        .attr('style','margin-top:5px;')
                        .append(levelLabel)
                        
                    const levelDeleteBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','padding-left: 5px; padding-right: 0')
                            .hover(function() {
                                $( this ).attr('style','color: #dc3545;padding-left: 5px; padding-right: 0');
                            }, function() {
                                $( this ).attr('style','color: #fff;padding-left: 5px; padding-right: 0');
                            })
                            .html('<i class="fas fa-times"></i>')
                            .on('click',()=>levelDelete(levels[levelIndex])),
                          levelUpdateBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right')
                            .attr('style','padding-left: 0; padding-right: 5px')
                            .hover(function() {
                                $( this ).attr('style','color: #666;padding-left: 0; padding-right: 5px');
                            }, function() {
                                $( this ).attr('style','color: #fff;padding-left: 0; padding-right: 5px');
                            })
                            .html('<i class="fas fa-pen"></i>')
                            .on('click',()=>levelUpdate(levels[levelIndex])),
                          levelOptions = $('<div></div>')
                            .attr('class','levelOptions float-right')
                            .attr('style','z-index:1; margin-top: -32px;')
                            .append(levelDeleteBtn)
                            .append(levelUpdateBtn)
                          
                          levelElement
                            .append(levelOptions)
                            .on('click',()=>{
                                $('#'+levels[levelIndex].id+'.subLevelContainer').toggle()
                            });


                    


                $('#overviewTargetLevelsBtns').append(levelElement)
                levelElement.after(subLevelContainer);
                overviewTargetSubLevels(levels[levelIndex]);
            }
            $('#overviewTargetLevelsBtns').sortable({
                start : function( event, ui ) {
                    $(event.target).addClass('grabbing')
                },
                stop : function( event, ui  ) {
                    $(event.target).removeClass('grabbing')
                }
            });
        }
    });
    
      

}

function assignMedientTarget(target){
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
                    body : 'Weet je zeker dat je leerdoel <b>'+target.name+'</b> wil toewijzen aan <b>'+medient.name+'</b>?',
                    buttons : [ { txt : 'Bevestigen', event : ['click',()=>{
                        component.api({
                            method : 'post',
                            url : 'api/medients/target/add',
                            data : {
                                medient : medient.id,
                                target : target.id
                            },
                            callback : ()=>{
                                $('#amModal').modal('hide');
                                $('#TargetAssignMedients').hide()
                                $('#overviewTargetAssignMedientInput').val('')
                                component.alert({
                                    message : 'Leerdoel <b>'+target.name+'</b> is toegewezen aan '+medient.name
                                })
                            }
                        })
                    }]},{txt : 'Annuleren', class: 'secondary', event:['click',()=>{
                        $('#amModal').modal('hide')
                    }]}]
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
}
function levelDelete(level){
    component.modal({
        title : '<i class="fas fa-times"></i> Level verwijderen',
        body : 'Weet je zeker dat je <b>'+level.name+ '</b> wilt verwijderen?',
        buttons : [
            {txt : 'Bevestigen', event:['click',()=>{
                component.api({
                    method : 'delete',
                    url : `api/levels/${level.id}`,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        overviewTargetLevels(level.target)
                        component.alert({
                            message : `<i class="fas fa-times"></i> Level verwijderd`
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

function levelUpdate(level){
    const updateLevelForm = component.form.fromModel({
        id : 'updateLevelForm',
        model : 'Level',
        fields : {
            name : { label : 'Naam', value : level.name }
        }
    });
    component.modal({
        title : 'Level aanpassen',
        body : updateLevelForm,
        buttons : [{txt : 'Opslaan', event : ['click', () => {
                level.name = $('#updateLevelForm #name').val()
                axios.put('api/levels',level ).then((response) => {
                    $('#amModal').modal('hide')
                    component.alert({message : '<i class="fas fa-pen"></i> Level aangepast'})
                    overviewTargetLevels(level.target)
                }).catch(error => {
                });
            }]
        }]
    })
}

function subjectTargetsBtns(args){

    for(const target of args.targets){
        if(target.subject === args.subject.id){
            const targetBtn = component.btn({
                txt : target.name,
                class : 'yellow btn-block left ui-state-default',
                id : target.id,
                event : ['click',()=>{
                    target.subject = args.subject
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
                                            target.subject = args.subject
                                            overviewTargetLevels(target)
                                         })
            targetElement.append(targetElementLabel)
            const targetDeleteBtn = $('<button></button>')
                .attr('class','btn btn-nobg')
                .html('<i class="fas fa-times"></i>')
                .on('click',(event)=>targetDelete(target))
            const targetUpdateBtn = $('<button></button>')
            .attr('class','btn btn-nobg')
            .html('<i class="fas fa-pen"></i>')
            .on('click',(event)=>targetUpdate(target))

            
            const targetOptions = $('<div></div>')
                .attr('class','targetOptions float-right')
                .attr('style','margin-top:-38px;')
            
            const targetContainer = $('<div></div>')
                .attr('class','targetContainer')
                .attr('id',target.id)
            
            
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
            { txt : 'Verwijderen', event : ['click',()=>{
                component.api({
                    method : 'delete',
                    url : 'api/targets/'+target.id,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        targetsOverview()
                    }
                })
            }]},
            {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
                $('#amModal').modal('hide')
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
                    targetsOverview()
                }).catch(error => {
                    
                });
            }]
        },
        {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
            $('#amModal').modal('hide')
        }]}]
    })
}

function overviewTargetSubLevels(level){
    const subLevelContainer = $('#'+level.id+'.subLevelContainer').html(''),
          subLevelAddBtn = component.btn({ 
            html : '<i class="fas fa-plus"></i> Sublevel toevoegen', 
            event : ['click',()=>addSubLevel(level)],
            class : 'btn-nobg btn-block text-muted left'
          });
   
    subLevelContainer.append(subLevelAddBtn);
    
    component.api({
        url : 'api/sublevels/'+level.id,
        callback : (sublevels)=>{
     
            for(const sublevel of sublevels){
                sublevel.level = level // replace sublevel object level property with level object
                const subLevelElement = $('<div></div>')
                        .attr('class','subLevelElement subLevelContainer btn btn-block btn-white green ui-sortable-handle pointer shadow')
                        .attr('style','margin-top:5px;'),
                      subLevelLabelTxt = sublevel.name.replace(/<3/g,'♥'),
                      subLevelLabel = $('<div></div>')
                        .html(subLevelLabelTxt)
                        .attr('style','width:80%')
                        .attr('class','subLevelElementLabel left'),
                      subLevelOptions = $('<div></div>')
                        .attr('class','subLevelOptions float-right')
                        .attr('style','z-index:1; padding-top:10px;'),
                      subLevelDeleteBtn = $('<button></button>')
                        .attr('class','btn btn-nobg green float-right')
                        .attr('style','margin-top:-40px;')
                        .html('<i class="fas fa-times"></i>')
                        .on('click',(event)=>subLevelDelete(sublevel,level)),
                      subLevelUpdateBtn = $('<button></button>')
                        .attr('class','btn btn-nobg green float-right')
                        .attr('style','margin-top:-40px; margin-right:20px;')
                        .html('<i class="fas fa-pen"></i>')
                        .on('click',(event)=>subLevelUpdate(sublevel,level));
                subLevelElement.append(subLevelLabel);
                subLevelOptions.append(subLevelUpdateBtn);
                subLevelOptions.append(subLevelDeleteBtn);
                subLevelElement.append(subLevelOptions);
                subLevelContainer.prepend(subLevelElement); 
                   
            }
        }
    })
    
    
}

function addSubLevel(level){
    const addSubLevelForm = component.form.fromModel({
        id : 'addSubLevelForm',
        model : 'Level',
        fields : {
            name : { label : 'Naam' }
        }
    });
    
    component.modal({
        title : 'Sublevel toevoegen',
        body : addSubLevelForm,
        buttons : [{ txt : 'Opslaan', event : ['click',() => {
            const AddSubLevelData = component.form.fields({ el : '#addSubLevelForm' });
            AddSubLevelData.level = level.id;
            AddSubLevelData.target = level.target.id;
            AddSubLevelData.subject = level.subject;
            component.api({
                url : 'api/sublevels',
                method: 'post',
                data : AddSubLevelData,
                callback : ()=>{
                    $('#amModal').modal('hide');
                    overviewTargetSubLevels(level);
                }
            });           
        }]},
        {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
            $('#amModal').modal('hide')
        }]}]
    });

}

function subLevelUpdate(sublevel,level){
 
    const updateSubLevelForm = component.form.fromModel({
        id : 'updateSubLevelForm',
        model : 'Target',
        fields : {
            name : { label : 'Naam', value : sublevel.name }
        }
    });
    component.modal({
        title : 'Sublevel aanpassen',
        body : updateSubLevelForm,
        buttons : [{txt : 'Opslaan', event : ['click', () => {
                const subLevelData = sublevel
                subLevelData.level = sublevel.level.id; // assign id to level property of sublevel object
                subLevelData.name = $('#updateSubLevelForm #name').val();
                axios.put('api/sublevels',subLevelData ).then(() => {
                    $('#amModal').modal('hide');
                    component.alert({message : '<i class="fas fa-pen"></i> Sublevel aangepast'})
                    
                    overviewTargetSubLevels(level);
                }).catch(error => {
                    
                });
            }]
        },
        {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
            $('#amModal').modal('hide')
        }]}]
    })
}

function subLevelDelete(sublevel, level){
    component.modal({
        title : 'Sublevel verwijderen',
        body : 'Weet je zeker dat je <b>'+sublevel.name+'</b> wilt verwijderen?',
        buttons : [
            { txt : 'Verwijderen', event : ['click',()=>{
                component.api({
                    method : 'delete',
                    url : 'api/sublevels/'+sublevel.id,
                    callback : ()=>{
                        $('#amModal').modal('hide')
                        component.alert({message : '<i class="fas fa-pen"></i> Sublevel verwijderd'})
                        overviewTargetSubLevels(sublevel.level);
                    }
                })
            }]},
            {txt : 'Annuleren', class: 'secondary', event:['click',()=>{
                $('#amModal').modal('hide')
            }]}
        ]
    })
}

application.add('targets',targets);