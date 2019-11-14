module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Profile',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING},
        auth : {type: Sequelize.STRING}
    });
}
