module.exports = (sequelize, Sequelize) => {
    return sequelize.define('SubLevel',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        level : {type: Sequelize.STRING},
        target : {type: Sequelize.STRING},
        subject : {type: Sequelize.STRING},
        name: {type: Sequelize.STRING},
        description : {type: Sequelize.STRING}
        
    });
}