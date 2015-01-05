'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    List = mongoose.model('List'),
    _ = require('lodash'),
    audit = require('../models/plugins/audit');

/**
 * Create a List
 */
exports.create = function(req, res) {
    var list = new List(req.body);
    audit.processModel(list, req);
    list.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * Show the current List
 */
exports.read = function(req, res) {
    res.jsonp(req.list);
};

/**
 * Update a List
 */
exports.update = function(req, res) {
    var list = req.list;

    delete req.body.wishes;

    list = _.extend(list, req.body);
    audit.processModel(list, req);

    list.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * Delete an List
 */
exports.delete = function(req, res) {
    var list = req.list;

    list.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * List of Lists
 */
exports.list = function(req, res) {
    List.find({
            'users.user': req.user
        }).sort('-created')
        .populate('audit.createUser', 'displayName')
        .populate('users.user', 'displayName')
        .exec(function(err, lists) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(lists);
            }
        });
};

/**
 * List middleware
 */
exports.listByID = function(req, res, next, id) {
    List.findById(id)
        .populate('audit.createUser', 'displayName')
        .populate('users.user', 'displayName')
        .exec(function(err, list) {
            if (err) return next(err);
            if (!list) return next(new Error('Failed to load List ' + id));
            req.list = list;
            next();
        });
};

/**
 * List authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (!_.any(req.list.users, function(item) {
            return item.user.id === req.user.id;
        })) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
