module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Target',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        category : {type: Sequelize.STRING},
        subject : {type: Sequelize.STRING},
        name: {type: Sequelize.STRING},
        description : {type: Sequelize.STRING}
        
    });
}