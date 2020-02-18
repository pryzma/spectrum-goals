module.exports =  (sequelize, Sequelize) => {
    return sequelize.define('MedientTargetSubLevel',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        medient : {type: Sequelize.STRING},
        target : {type: Sequelize.STRING},
        sublevel : {type: Sequelize.STRING},
        completed : {type: Sequelize.STRING}
    })
  }