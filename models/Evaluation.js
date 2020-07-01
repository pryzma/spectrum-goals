module.exports =  (sequelize, Sequelize) => {
  return sequelize.define('Evaluation',{
      id: {
          type: Sequelize.STRING,
          notEmpty: true,
          primaryKey: true
      },
      medient: {type: Sequelize.STRING},
      target : {type: Sequelize.STRING},
      evaluation : {type: Sequelize.STRING},
      createdBy: {
        type: Sequelize.STRING,
        notEmpty: false
    },
      date : {type: Sequelize.DATE}
  })
}