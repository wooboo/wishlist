'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    audit = require('./plugins/audit');

/**
 * Wish Schema
 */
var WishSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Wish name',
        trim: true
    },
    list: {
        type: Schema.ObjectId,
        ref: 'List',
        required: 'Please select a List'
    },
    url: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: '',
        trim: true
    }

});
WishSchema.plugin(audit);

mongoose.model('Wish', WishSchema);
