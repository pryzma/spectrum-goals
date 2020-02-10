module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Category',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING},
        description : {type: Sequelize.STRING}
    });
}