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
                    const subjectHeader = $('<p></p>')
                        .addClass('h2 bold green center')
                        .html(subject.name),
                        addTargetBtn = component.btn({ 
                            html : '<i class="fas fa-plus"></i> Leerdoel toevoegen', 
                            event : ['click',()=>addTarget(subject.id)],
                            class : 'btn-nobg text-muted'
                        }),
                        targetBtnsContainer = $('<div></div>').attr('class','targetBtnsContainer'),
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
                //}
            }
        }
    })

}
function subjectTargetsBtns(args){
    for(const target of args.targets){
        if(target.subject === args.subject.id){
            const targetBtn = component.btn({
                txt : target.name,
                class : 'yellow btn-block',
                id : target.id
            })
            args.container.prepend(targetBtn);
        }
    }
}
function targetCreate(){
    $.get('html/templates/targetCreate.html', (data) => {
        $(application.config.main).html(data);
    
      });
}
application.add('targets',targets);