'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Compensationform Schema
 */
var CompensationformSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    institution: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    postalCode: {
        type: String,
        default: ''
    }
});

mongoose.model('Compensationform', CompensationformSchema);
