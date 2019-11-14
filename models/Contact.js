module.exports =  (sequelize, Sequelize) => {
    return sequelize.define('Contact',{
        id: {
            type: Sequelize.STRING,
            notEmpty: true,
            primaryKey: true
        },
        contact_type_id: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        organisation: {
            type: Sequelize.STRING
        },
        street_address: {
            type: Sequelize.STRING
        },
        postal_code: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        country : {
            type: Sequelize.STRING
        },
        street_address_secondary: {
            type: Sequelize.STRING
        },
        postal_code_secondary: {
            type: Sequelize.STRING
        },
        city_secondary: {
            type: Sequelize.STRING
        },
        state_secondary: {
            type: Sequelize.STRING
        },
        country_secondary : {
            type: Sequelize.STRING
        }
    })
}
