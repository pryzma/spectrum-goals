module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Addition',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        module: {type: Sequelize.STRING},
        account: {type: Sequelize.STRING},
        date : { type : Sequelize.DATE}
    });
}