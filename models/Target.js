module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Target',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        category : {type: Sequelize.STRING},
        order : {type: Sequelize.INTEGER},
        subject : {type: Sequelize.STRING},
        name: {type: Sequelize.STRING},
        order : {type: Sequelize.INTEGER},
        createdBy: {
            type: Sequelize.STRING,
            notEmpty: false
        },
        description : {type: Sequelize.STRING}
        
    });
}