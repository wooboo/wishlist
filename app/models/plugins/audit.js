'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Audit Schema plugin
 */
module.exports = exports = function auditPlugin(schema, options) {
    schema.add({
        audit: {
            updateDate: {
                type: Date
            },
            createDate: {
                type: Date
            },
            user: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            updateUser: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            createUser: {
                type: Schema.ObjectId,
                ref: 'User'
            }
        }
    });

    schema.pre('save', function(next) {
        var date = new Date();
        var user = this.audit.user;
        if (this.isNew) {
            this.audit.createUser = user;
            this.audit.createDate = date;
        } else {
            this.audit.updateUser = user;
            this.audit.updateDate = date;
        }
        next();
    });

};
module.exports.cleanRequest = function cleanRequest(req, res, next) {
    delete req.body.audit;
    next();
};
module.exports.processModel = function processModel(model, req) {
    model.audit = model.audit || {};
    model.audit.user = req.user;
};
