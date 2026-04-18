const users =  {}; 

function createUser(overrides = {}) {
    return {
        subscribed: false,
        setupComplete: false,
        preferences: {
            zipcode: null,
            locationName: null,
            species: null,
            sendTime: null
        },
        ...overrides
    };
}

module.exports = {
    createUser,
    users
};