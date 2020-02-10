module.exports =  (sequelize, Sequelize) => {
    return sequelize.define('EvaluationTarget',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        target : {type: Sequelize.STRING},
        evaluation : {type: Sequelize.STRING}
    })
  }