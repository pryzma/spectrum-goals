module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Medient', {
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        account: {
            type: Sequelize.STRING
        },
        indication: { //Eind Datum
            type: Sequelize.DATE
        },
        BSN: {
            type: Sequelize.INTEGER
        },
        date_of_birth: {
            type: Sequelize.DATEONLY
        },
        gender: {
            type: Sequelize.INTEGER
        },
        client_passed_away: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        order_number: { //beschikkingsnummer
            type: Sequelize.INTEGER
        },
        product_category: {
            type: Sequelize.INTEGER
        },
        start_date: {
            type: Sequelize.DATEONLY
        },
        product_code: {
            type: Sequelize.STRING
        },
        volume: {
            type: Sequelize.INTEGER
        },
        time_unit: {
            type: Sequelize.INTEGER
        },
        btw_exemption: {
            type: Sequelize.BOOLEAN
        },
        btw_percentage: {
            type: Sequelize.INTEGER
        },
        btw_amount: {
            type: Sequelize.DECIMAL
        },
        declaration_amount: {
            type: Sequelize.DECIMAL
        },
        reference_number_credit: {
            type: Sequelize.INTEGER
        },
        allocation_number: {
            type: Sequelize.INTEGER
        }
    });
}
