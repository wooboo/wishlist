'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var wishes = require('../../app/controllers/wishes.server.controller'),
        audit = require('../models/plugins/audit');

    // Wishes Routes
    app.route('/lists/:listId/wishes')
        .get(wishes.list)
        .post(users.requiresLogin, audit.cleanRequest, wishes.create);

    app.route('/lists/:listId/wishes/:wishId')
        .get(wishes.read)
        .put(users.requiresLogin, wishes.hasAuthorization, audit.cleanRequest, wishes.update)
        .delete(users.requiresLogin, wishes.hasAuthorization, wishes.delete);

    // Finish by binding the Wish middleware
    app.param('wishId', wishes.wishByID);
};
