'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    audit = require('./plugins/audit');

/**
 * List Schema
 */
var ListSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill List name',
        trim: true
    },
    users: {
        type: [{
            email: {
                type: String,
                //required: 'Email is required'
            },
            user: {
                type: Schema.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['owner', 'moderator', 'guest'],
                default: 'guest'
            }
        }, ]
    },
    wishes: [{
        name: {
            type: String,
            default: '',
            required: 'Name is required',
            trim: true
        },
        photo: String,
        url: String
    }]
});

ListSchema.plugin(audit);

/**
 * adding default owner
 */
ListSchema.pre('save', function(next) {
    var User = mongoose.model('User');
    var setEmail = function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User'));
        user.email = user.user.email;
    };

    if (this.isNew) {
        this.users.push({
            user: this.audit.user,
            role: 'owner'
        });
    }
    var done = _.after(this.users.length, next);
    _.forEach(this.users, function(u) {
        if (u.user && !u.email) {
            User.findOne({
                _id: u.user._id
            }).exec(function(err, user) {
                if (err) return next(err);
                if (user) {
                    u.email = user.email;
                }
                done();
            });
        } else if (!u.user && u.email) {
            User.findOne({
                email: u.email
            }).exec(function(err, user) {
                if (err) return next(err);
                if (user) {
                    u.user = user;
                }
                done();
            });
        } else {
            done();
        }
    });

});


mongoose.model('List', ListSchema);
