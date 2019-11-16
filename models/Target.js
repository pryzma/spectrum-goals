module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Target',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING},
        subject: {type: Sequelize.STRING}
    });
}