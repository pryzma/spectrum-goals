module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Medient',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        account: {type: Sequelize.STRING},
        indication : {type: Sequelize.DATE}
    });
}
