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
            type: Sequelize.STRING
        },
        date_of_birth: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        order_number: { //beschikkingsnummer
            type: Sequelize.STRING
        },
        product_category: {
            type: Sequelize.STRING
        },
        start_date: {
            type: Sequelize.STRING
        },
        product_code: {
            type: Sequelize.STRING
        },
        volume: {
            type: Sequelize.STRING
        },
        time_unit: {
            type: Sequelize.STRING
        },
        btw_exemption: {
            type: Sequelize.STRING
        },
        btw_percentage: {
            type: Sequelize.STRING
        },
        btw_amount: {
            type: Sequelize.STRING
        },
        declaration_amount: {
            type: Sequelize.STRING
        },
        reference_number_credit: {
            type: Sequelize.STRING
        },
        allocation_number: {
            type: Sequelize.STRING
        }
    });
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
            type: Sequelize.STRING
        },
        date_of_birth: {
            type: Sequelize.DATEONLY
        },
        gender: {
            type: Sequelize.STRING
        },
        order_number: { //beschikkingsnummer
            type: Sequelize.INTEGER
        },
        product_category: {
            type: Sequelize.STRING
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
            type: Sequelize.STRING
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
            type: Sequelize.STRING
        },
        allocation_number: {
            type: Sequelize.INTEGER
        }
    });
}
