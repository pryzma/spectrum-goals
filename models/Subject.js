module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Subject',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        category: {type: Sequelize.STRING},
        name: {type: Sequelize.STRING}
    });
}