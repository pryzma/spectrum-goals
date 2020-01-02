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
component.targetSublevels = (args)=>{
    const targetSublevelsClass = 'target-sublevels'
          $targetSublevelsContainer = $('<div></div>')
            .attr('class',targetSublevelsClass)
    for(const sublevel in args.sublevels){
        $targetSublevelsContainer.append(
            $('<button></button>')
                .attr('class','btn btn-sublevel')
                .html(sublevel.name)
            );
    }
    $(`div.${targetSublevelsClass}`).remove();
    $(`button.btn#${args.id}`).after($targetSublevelsContainer);

}
component.targetOverview = (args)=>{
    if(!typeof args === 'object') component.err('component.targetOverview args is not a object but '+typeof args)
    const $rowElement = () => $('<div></div>')
            .attr('class','row'),
          $colElement = () => $('<div></div>')
            .attr('class','col-md'),
          $btnElement = (btn) => $('<button></button>')
            .attr('class','btn btn-subject')
            .attr('id',btn.id)
            .html(btn.txt);
    const $subjectRow = $rowElement()
            .attr('id','subjects')
    for(let subject in args.subjects){
        const $subjectCol = $colElement().attr('id',subject.id)
                .append($('<h4></h4>').html(subject.title));
        for(const target in subject.targets){
            const btn = {
                txt : target.name,
                id : target.id,
                sublevels : target.sublevels
            }
            $subjectCol.append($btnElement(btn));
        }
        $subjectRow.append($subjectCol);
    }
    if(args.el){
        $(args.el).html($subjectRow).promise().then(()=>{
            $('button.btn-subject').on('click',(event)=>{
                const targetId = event.target.id
                component.targetSublevels({id : targetId})
            });
        });
    }
    return $subjectRow
}
function targetsOverview(){
    $('#targetCategoriesContent .tab-pane').each(function(){
                        
        if($(this).hasClass('active')){

            overviewSubjects($(this).attr('data-category'))
        }
    });
 
    $('#addSubject').on('click',addSubject)
    $('#targetCreateBtn').on('click',targetCreate)
    
}
function targetView(id){

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
    
    component.api({
        url : 'api/subjects',
        callback : (subjects) =>{
            const subjectsContainer = $(`#${category}Subjects div.row`)
            $('.subjectContainer').remove()
            for(const subject of subjects){
                //if(subjects.category === category){
                    const addTargetBtn = component.btn({ 
                            html : '<i class="fas fa-plus"></i> Leerdoel toevoegen', 
                            event : ['click',()=>addTarget(subject.id)],
                            class : 'btn-nobg btn-block text-muted left addTarget'
                          }),
                          targetBtnsContainer = $('<div></div>').attr('class','targetBtnsContainer'),
                          subjectDeleteBtn = $('<button></button>')
                            .attr('class','btn btn-nobg float-right red')
                            .attr('style','margin-top:-40px;')
                            .html('<i class="fas fa-times"></i>')
                            .on('click',(event)=>{
                                component.modal({
                                    title : '<i class="fas fa-times"></i> Onderwerp  verwijderen',
                                    body : 'Weet je zeker dat je <b>'+subject.name+ '</b> (en onderliggende leerdoelen) wilt verwijderen?',
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
                                
                            }),
                          
                          subjectOptions = $('<div></div>')
                            .attr('class','subjectOptions float-right')
                            .append(subjectDeleteBtn),
                          subjectHeader = $('<p></p>')
                            .addClass('subjectHeader h4 bold green center')
                            .attr('id',`subjectHeader_${subject.id}`)
                            .html(subject.name),
                          subjectContainer = $('<div></div>')
                            .attr('id',subject.id)
                            .attr('class','subjectContainer')
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
                                  subject : subject
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
    $('#overviewTargetLevelsBtns').html('');
    component.api({
        url : `api/levels/${target.id}`,
        callback : (levels) => {
            $('#targetCategoriesContent').hide();
            $('#overviewTargetLevels').show();
            location.hash = '#'+target.id
            $('#targetCategoriesTabs').off().on('click',function(){
                $('#overviewTargetLevels').hide();
                $('#targetCategoriesContent').show();
            })
            $('.overviewTargetSubjectName').html(target.name);
            $('#addTargetLevel').off().on('click',()=>addTargetLevel(target))
            for(const levelIndex in levels){
                const levelBtn = component.btn({
                    txt : `Level ${levelIndex/1+1} : ${levels[levelIndex].name}`,
                    class : 'block left btn-primary btn-green'
                })
                $('#overviewTargetLevelsBtns').append(levelBtn)
            }
        }
    })
    
      

}
function subjectTargetsBtns(args){
    for(const target of args.targets){
        if(target.subject === args.subject.id){
            const targetBtn = component.btn({
                txt : target.name,
                class : 'yellow btn-block left',
                id : target.id,
                event : ['click',()=>{
                    overviewTargetLevels(target)
                }]
            })
            const targetDeleteBtn = $('<button></button>')
                .attr('class','btn btn-nobg')
                .html('<i class="fas fa-times"></i>')
                .on('click',(event)=>{
                     
                    component.api({
                        method : 'delete',
                        url : `api/targets/${target.id}`,
                        callback : () => {
                            component.alert({
                                message : '<i class="fas fa-times"></i> Leerdoel verwijderd'
                            })
                        }
                    })
                })
            const targetOptions = $('<div></div>')
                .attr('class','targetOptions float-right')
                .attr('style','margin-top:-34px;')
            const targetContainer = $('<div></div>')
                .attr('class','targetContainer')
                
            targetOptions.append(targetDeleteBtn);
            targetContainer.append(targetBtn);
            targetContainer.append(targetOptions);
            args.container.prepend(targetContainer);

        }
    }
}
function targetCreate(){
    $.get('html/templates/targetCreate.html', (data) => {
        $(application.config.main).html(data);
    
      });
}
application.add('targets',targets);