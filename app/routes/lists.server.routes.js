'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller'),
        lists = require('../../app/controllers/lists.server.controller'),
        audit = require('../models/plugins/audit');

    // Lists Routes
    app.route('/lists')
        .get(lists.list)
        .post(users.requiresLogin, audit.cleanRequest, lists.create);

    app.route('/lists/:listId')
        .get(lists.read)
        .put(users.requiresLogin, lists.hasAuthorization, audit.cleanRequest, lists.update)
        .delete(users.requiresLogin, lists.hasAuthorization, lists.delete);

    // Finish by binding the List middleware
    app.param('listId', lists.listByID);
};
