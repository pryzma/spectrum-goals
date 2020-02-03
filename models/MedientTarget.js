module.exports = (sequelize, Sequelize) => {
    return sequelize.define('MedientTarget',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        category: {type: Sequelize.STRING},
        subject: {type: Sequelize.STRING},
        medient: {type: Sequelize.STRING},
        target : {type: Sequelize.STRING}
    });
}