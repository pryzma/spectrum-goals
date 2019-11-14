const targets = {
    name : 'Leerdoelen',
    default : targetsOverview
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
            )
    }
    $(`div.${targetSublevelsClass}`).remove()
    $(`button.btn#${args.id}`).after($targetSublevelsContainer)

}
component.targetOverview = (args)=>{
    if(!typeof args === 'object') component.err('component.targetOverview args is not a object but '+typeof args)
    const $rowElement = () => $('<div></div>')
            .attr('class','row'),
          $colElement = () => $('<div></div>')
            .attr('class','col-md'),
          $btnElement = (txt) => $('<button></button>')
            .attr('class','btn btn-subject')
            .html(txt);
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
    const targetsOverviewTable = {
        el : 'targetsOverview',
        model : 'Target',
        data : targetsData,
        methods : {
            onRowClick : (event)=>{
                const id = target.parentElement.id;
                targetView(id)
            }
        }
    }
    return component.table(targetsOverviewTable)
}
function targetView(id){

}
application.add(targets);