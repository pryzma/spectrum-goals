module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Notification',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        date : {type: Sequelize.DATE},
        account: {type: Sequelize.STRING},
        action : {type: Sequelize.STRING}
    });
}
