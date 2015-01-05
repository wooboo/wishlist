'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Wish = mongoose.model('Wish'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    audit = require('../models/plugins/audit');

/**
 * Create a Wish
 */
exports.create = function(req, res) {
    var wish = new Wish(req.body);
    wish.list = req.list;
    audit.processModel(wish, req);

    wish.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(wish);
        }
    });
};

/**
 * Show the current Wish
 */
exports.read = function(req, res) {
    res.jsonp(req.wish);
};

/**
 * Update a Wish
 */
exports.update = function(req, res) {
    var wish = req.wish;

    wish = _.extend(wish, req.body);
    audit.processModel(wish, req);

    wish.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(wish);
        }
    });
};

/**
 * Delete an Wish
 */
exports.delete = function(req, res) {
    var wish = req.wish;

    wish.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(wish);
        }
    });
};

/**
 * List of Wishes
 */
exports.list = function(req, res) {
    Wish.find({
            'list': req.list._id
        }).sort('-created')
        .populate('audit.createUser', 'displayName')
        .populate('list')
        //.populate('list.users')
        .exec(function(err, wishes) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(wishes);
            }
        });
};

/**
 * Wish middleware
 */
exports.wishByID = function(req, res, next, id) {
    Wish.findById(id)
        .populate('audit.createUser', 'displayName')
        .populate('list')
        //.populate('list.users')
        .exec(function(err, wish) {
            if (err) return next(err);
            if (!wish) return next(new Error('Failed to load Wish ' + id));
            req.wish = wish;
            // Deep population is here
            User.populate(wish.list.users, {
                    path: 'user'
                },
                function(err, users) {
                    if (err) return next(err);
                    next();
                });
        });
};

/**
 * Wish authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (!_.any(req.wish.list.users, function(item) {
            return item.user.id === req.user.id;
        })) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
