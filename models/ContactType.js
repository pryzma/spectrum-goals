module.exports =  (sequelize, Sequelize) => {
    return sequelize.define('ContactType',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        type: {type: Sequelize.STRING},
        model : {type: Sequelize.STRING},
    })
}