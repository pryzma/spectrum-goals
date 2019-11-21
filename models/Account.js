module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Account',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        username: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        profile: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        contact:{
            type: Sequelize.STRING,
            notEmpty: true
        },
        firstName: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        lastName: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        isActivated: {
            type: Sequelize.INTEGER,
            notEmpty : true
        },
        password: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        createdBy: {
            type: Sequelize.STRING,
            notEmpty: false
        }
    });
}
