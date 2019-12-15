module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Level',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        target : {type: Sequelize.STRING},
        name: {type: Sequelize.STRING},
        description : {type: Sequelize.STRING}
        
    });
}