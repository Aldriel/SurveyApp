'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Page Schema
 */
var PageSchema = new Schema({
    title: {
        type: String
    },
    header: {
        type: String
    },
    number: Number,
    questions: [
        {
            type: Schema.ObjectId,
            ref: 'Question'
        }
    ],
    survey: {
        type: Schema.ObjectId,
        ref: 'Survey'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    nextButtonText: {
        type: String,
        default: 'Next'
    },
    previousButtonText: {
        type: String,
        default: 'Previous'
    }
});

mongoose.model('Page', PageSchema);
