module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Subject',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING}
    });
}