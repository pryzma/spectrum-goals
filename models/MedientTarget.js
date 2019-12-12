module.exports = (sequelize, Sequelize) => {
    return sequelize.define('MedientTarget',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        medient: {type: Sequelize.STRING},
        target : {type: Sequelize.STRING}
    });
}