module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Checklist',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING},
        date : {type: Sequelize.STRING},
        expires : {type: Sequelize.STRING},
        message : {type: Sequelize.STRING},
        account : {type: Sequelize.STRING},
        medient : {type: Sequelize.STRING}
    });
}