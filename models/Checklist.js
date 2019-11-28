module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Checklist',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        name: {type: Sequelize.STRING}
    });
}